const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const { JSDOM } = require('jsdom');

// Load the application's TypeScript using its declared compiler dependency.
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(
  fs.readFileSync(filename, 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }
).outputText, filename);
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
let exportedHtml;
const originalLoad = Module._load;
Module._load = function(name, ...args) {
  if (name === 'html2pdf.js') return () => ({ set() { return this; }, from(element) { exportedHtml = element.innerHTML; return this; }, async save() {} });
  if (name === 'file-saver') return { saveAs() {} };
  return originalLoad.call(this, name, ...args);
};
const documents = require('../src/lib/converters/documentConverter.ts');
const { convertImage } = require('../src/lib/converters/imageConverter.ts');
const { extractVideoFrame, createVideoThumbnail } = require('../src/lib/converters/videoConverter.ts');
const { ConversionService } = require('../src/lib/conversionService.ts');
Module._load = originalLoad;

test('document exports remove active content and remote resources', async () => {
  const payload = '<p onclick="alert(1)">Hello</p><img src="https://example.com/track" onerror="alert(2)"><svg onload="alert(3)"></svg><iframe srcdoc="bad"></iframe><script>alert(4)</script><a href="javascript:alert(5)">link</a><style>body{background:url(https://example.com)}</style>';
  await documents.convertHtmlToPDF(payload, 'test.pdf');
  assert.match(exportedHtml, /<p>Hello<\/p>/);
  assert.doesNotMatch(exportedHtml, /script|onclick|onerror|onload|iframe|svg|src=|style|javascript:|https:\/\/example/);
  assert.doesNotMatch(documents.markdownToHtml(payload), /onclick|script|src=|javascript:/);
});

test('plain text preserves literal markup in HTML exports', () => {
  const text = '<script>alert(1)</script> & <b>literal</b>';
  const html = documents.convertTextToHtml(text);
  const parsed = new JSDOM(html);
  assert.equal(parsed.window.document.querySelector('pre').textContent, text);
  assert.equal(parsed.window.document.querySelector('script'), null);
  parsed.window.close();
});

test('conversion menu offers encodable outputs and unsupported requests fail cleanly', async () => {
  for (const ext of ['jpg', 'png', 'webp', 'bmp', 'gif', 'svg', 'ico']) {
    assert.ok(ConversionService.getSupportedConversions(ext).every(format => ['jpg', 'png', 'webp'].includes(format)));
  }
  assert.deepEqual(ConversionService.getSupportedConversions('flac'), ['wav']);
  assert.deepEqual(ConversionService.getSupportedConversions('ogv'), ['jpg', 'png', 'thumbnail']);
  const result = await ConversionService.convert({ name: 'file.png' }, 'gif');
  assert.equal(result.success, false);
  await assert.rejects(convertImage({}, 'bmp'), /JPG, PNG and WebP/);
});

const createElement = document.createElement.bind(document);
let lastCanvas;
let encoderFallback = false;
let revoked = 0;
const installMedia = () => {
  global.URL.createObjectURL = () => 'blob:test';
  global.URL.revokeObjectURL = () => { revoked++; };
  document.createElement = tag => {
    if (tag === 'canvas') return lastCanvas = {
      width: 0, height: 0,
      getContext: () => ({ drawImage() {}, fillRect() {}, fillStyle: '' }),
      toBlob(callback, type) { callback(new Blob(['encoded'], { type: encoderFallback ? 'image/png' : type })); }
    };
    if (tag === 'video') return {
      duration: 10, videoWidth: 800, videoHeight: 400, readyState: 0, seeking: false, _time: 0,
      get currentTime() { return this._time; },
      set currentTime(time) { this._time = time; queueMicrotask(() => { this.readyState = 2; this.onseeked?.(); }); },
      set src(value) { queueMicrotask(() => { this.onloadedmetadata?.(); this.readyState = 2; this.onloadeddata?.(); }); },
      removeAttribute() {}, load() {}
    };
    return createElement(tag);
  };
  global.Image = class {
    width = 800; height = 400;
    set src(value) { queueMicrotask(() => this.onload()); }
  };
  global.FileReader = class {
    readAsDataURL() { this.onload({ target: { result: 'data:image/png;base64,' } }); }
  };
};

test('image resizing preserves aspect ratio within both requested dimensions', async () => {
  installMedia();
  const blob = await convertImage({}, 'webp', { width: 200, height: 200 });
  assert.equal(blob.type, 'image/webp');
  assert.equal(lastCanvas.width, 200);
  assert.equal(lastCanvas.height, 100);
  await assert.rejects(convertImage({}, 'png', { width: -1 }), /dimensions/);
});

test('browser encoder fallback cannot silently produce a mislabeled file', async () => {
  installMedia();
  encoderFallback = true;
  try { await assert.rejects(convertImage({}, 'webp'), /cannot encode/); }
  finally { encoderFallback = false; }
});

test('frame zero resolves without a seek event and PNG output has PNG media type', async () => {
  installMedia();
  const before = revoked;
  const blob = await extractVideoFrame({}, 0, 'png');
  assert.equal(blob.type, 'image/png');
  assert.equal(revoked, before + 1);
  assert.equal((await extractVideoFrame({}, 2, 'jpg')).type, 'image/jpeg');
  assert.equal((await createVideoThumbnail({})).type, 'image/jpeg');
  assert.equal(lastCanvas.width, 320);
  assert.equal(lastCanvas.height, 180);
});

test('invalid frame times reject and release their media resources', async () => {
  installMedia();
  const before = revoked;
  await assert.rejects(extractVideoFrame({}, 11), /outside/);
  assert.equal(revoked, before + 1);
});
