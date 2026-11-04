# Universal File Converter - Usage Guide

## Quick Start

### 1. Accessing the Application
Open your browser and navigate to the application URL. You'll see the main interface with four category tabs:
- **Documents** 📄
- **Images** 🖼️
- **Audio** 🎵
- **Video** 🎬

### 2. Converting a File

#### Step-by-Step Process:

**Step 1: Select Category**
Click on the appropriate tab for your file type.

**Step 2: Upload File**
- Click "Select File" and choose a local file

**Step 3: Preview**
Your file will be displayed in the preview panel (left side).

**Step 4: Choose Target Format**
In the conversion panel (right side), select your desired output format from the dropdown.

**Step 5: Configure Options** (Optional)
Adjust format-specific settings like quality, dimensions, etc.

**Step 6: Convert**
Click "Convert & Download" button. Your converted file will automatically download.

## Detailed Examples

### Example 1: Converting Markdown to PDF

1. Click the **Documents** tab
2. Upload your `.md` file
3. Preview will show formatted markdown
4. Select **PDF** from target format dropdown
5. Click "Convert & Download"
6. Your PDF will download automatically

### Example 2: Resizing and Converting an Image

1. Click the **Images** tab
2. Upload your image (e.g., `photo.jpg`)
3. Preview shows your image
4. Select **PNG** as target format
5. Adjust options:
   - Set Quality: 85%
   - Width: 800px
   - Height: (leave empty for auto)
6. Click "Convert & Download"
7. Your resized PNG downloads

### Example 3: Extracting Audio Metadata

1. Click the **Audio** tab
2. Upload your audio file (e.g., `song.mp3`)
3. Audio player appears in preview
4. Select **WAV** as target format
5. Click "Convert & Download"
6. Converted WAV file downloads
7. Toast notification shows metadata (duration, sample rate)

### Example 4: Creating Video Thumbnail

1. Click the **Video** tab
2. Upload your video file (e.g., `clip.mp4`)
3. Video player appears in preview
4. Select **thumbnail** as target format
5. Click "Convert & Download"
6. Thumbnail image (JPG) downloads

## Supported Conversions by Category

### 📄 Documents

#### Markdown Files (.md)
- **Convert to**: HTML, PDF, DOCX, TXT
- **Use cases**: 
  - Create web pages from markdown
  - Generate printable PDFs
  - Share as Word documents
  - Extract plain text

#### Text Files (.txt)
- **Convert to**: HTML, PDF, Markdown
- **Use cases**:
  - Format plain text as web page
  - Create PDF from notes
  - Add markdown formatting

#### HTML Files (.html)
- **Convert to**: PDF, TXT
- **Use cases**:
  - Save web pages as PDF
  - Extract text content

### 🖼️ Images

#### Supported Formats
JPG, JPEG, PNG, GIF, WEBP, BMP, SVG, ICO

#### Common Conversions:
- **JPG → PNG**: For transparency support
- **PNG → JPG**: For smaller file size
- **Any → WEBP**: For modern web optimization
- **SVG/ICO → PNG**: Rasterize vector images and icons

#### Options Available:
- **Quality**: 1-100% (for JPG, WEBP)
- **Width**: Custom pixel width
- **Height**: Custom pixel height
- **Aspect Ratio**: Automatically maintained

#### Use Cases:
- Optimize images for web
- Convert for specific software requirements
- Resize for social media
- Reduce file size

### 🎵 Audio

#### Supported Input Formats
MP3, WAV, OGG, FLAC, AAC, M4A

#### Output Format
WAV (uncompressed)

#### Features:
- Extract metadata (duration, sample rate, channels)
- Convert to universal WAV format
- Maintain audio quality

#### Use Cases:
- Convert for audio editing software
- Extract audio information
- Create uncompressed backups

**Note**: Browser-based audio conversion is limited. For advanced conversions (MP3, OGG, etc.), consider server-side tools.

### 🎬 Video

#### Supported Input Formats
MP4, WEBM, AVI, MOV, MKV, OGV

#### Available Operations:
- **Frame Extraction**: Extract single frame as JPG/PNG
- **Thumbnail Creation**: Generate video thumbnail
- **Metadata Display**: View duration, resolution, file size

#### Use Cases:
- Create video thumbnails
- Extract specific frames
- Get video information
- Create preview images

**Note**: Full video format conversion requires server-side processing. This tool focuses on frame extraction and metadata.

## Tips & Best Practices

### 1. File Size Considerations
- **Large Files**: May take longer to process
- **Images**: Consider reducing dimensions for faster processing
- **Videos**: Frame extraction is quick, but large videos may take time to load

### 2. Quality Settings
- **Images**: 
  - 90-100%: High quality, larger file
  - 70-85%: Good balance
  - 50-70%: Smaller file, visible compression
- **Recommendation**: Start with 85% and adjust as needed

### 3. Dimension Settings
- Leave one dimension empty to maintain aspect ratio
- Set both dimensions to force specific size (may distort)
- Use even numbers for better compatibility

### 4. Format Selection
- **For Web**: Use WEBP (images), MP4 (video)
- **For Print**: Use PNG or high-quality JPG
- **For Editing**: Use uncompressed formats (PNG, WAV)
- **For Sharing**: Use compressed formats (JPG, MP3)

### 5. Privacy & Security
- All conversions happen in your browser
- Files never leave your device
- No server upload required
- Safe for sensitive documents

## Troubleshooting

### Issue: File won't upload
**Solution**: 
- Check file format is supported
- Ensure file isn't corrupted
- Try a different browser

### Issue: Conversion fails
**Solution**:
- Check file isn't too large (>100MB may cause issues)
- Ensure browser is up to date
- Try refreshing the page
- Check browser console for errors

### Issue: Preview not showing
**Solution**:
- Some formats don't support preview
- Check file format is correct
- Try re-uploading the file

### Issue: Downloaded file won't open
**Solution**:
- Ensure you have appropriate software
- Check file extension is correct
- Try different conversion settings

## Keyboard Shortcuts

- **Tab**: Navigate between elements
- **Enter**: Activate buttons
- **Esc**: Close dialogs (if any)

## Browser Compatibility

### Recommended Browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Required Features:
- Canvas API (for image conversion)
- Web Audio API (for audio processing)
- HTML5 Video (for video features)
- File API (for file handling)

## Getting Help

If you encounter issues:
1. Check this usage guide
2. Review the README.md
3. Check browser console for errors
4. Open an issue on GitHub
5. Ensure browser is up to date

## Advanced Usage

### Batch Processing (Future Feature)
Currently, files must be converted one at a time. Batch processing is planned for future releases.

### Custom Presets (Future Feature)
Save your favorite conversion settings for quick access. Coming soon!

### API Integration (Future Feature)
Programmatic access to conversion features. Under development.

## Feedback & Contributions

We welcome feedback and contributions!
- Report bugs on GitHub
- Suggest features
- Submit pull requests
- Share your use cases

---

**Happy Converting! 🚀**
## Browser conversion limits

Image output is JPG, PNG or WebP. GIF and BMP are input formats only; SVG and ICO inputs can be rasterized. PDF, DOCX and RTF input conversion is not implemented. FLAC audio and OGV video are supported when your browser can decode them. Document export removes active HTML, styles and remote resources.
