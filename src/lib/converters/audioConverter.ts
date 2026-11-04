// Audio conversion utilities using Web Audio API
// Note: Full audio conversion requires server-side processing or WebAssembly libraries
// This provides basic audio manipulation capabilities

export interface AudioConversionOptions {
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
}

export const getAudioMetadata = async (file: File): Promise<{
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
}> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);

    audio.addEventListener('loadedmetadata', () => {
      // Create audio context to get more details
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          resolve({
            duration: audioBuffer.duration,
            sampleRate: audioBuffer.sampleRate,
            numberOfChannels: audioBuffer.numberOfChannels,
          });
          
          URL.revokeObjectURL(url);
          audioContext.close();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load audio file'));
    });

    audio.src = url;
  });
};

export const convertAudioFormat = async (
  file: File,
  targetFormat: string,
  options: AudioConversionOptions = {}
): Promise<Blob> => {
  // Note: Browser-based audio conversion is limited
  // For production, consider using a server-side solution or WebAssembly library like FFmpeg.wasm
  
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // For now, we'll convert to WAV format as it's the most straightforward
        const wavBlob = audioBufferToWav(audioBuffer);
        resolve(wavBlob);
        audioContext.close();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Convert AudioBuffer to WAV format
const audioBufferToWav = (buffer: AudioBuffer): Blob => {
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;

  const data = interleave(buffer);
  const dataLength = data.length * bytesPerSample;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;

  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Write audio data
  floatTo16BitPCM(view, 44, data);

  return new Blob([arrayBuffer], { type: 'audio/wav' });
};

const interleave = (buffer: AudioBuffer): Float32Array => {
  const numberOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numberOfChannels;
  const result = new Float32Array(length);

  let offset = 0;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      result[offset++] = buffer.getChannelData(channel)[i];
    }
  }

  return result;
};

const writeString = (view: DataView, offset: number, string: string): void => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

const floatTo16BitPCM = (view: DataView, offset: number, input: Float32Array): void => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
};

export const trimAudio = async (
  file: File,
  startTime: number,
  endTime: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const sampleRate = audioBuffer.sampleRate;
        const startSample = Math.floor(startTime * sampleRate);
        const endSample = Math.floor(endTime * sampleRate);
        const newLength = endSample - startSample;

        const newBuffer = audioContext.createBuffer(
          audioBuffer.numberOfChannels,
          newLength,
          sampleRate
        );

        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
          const oldData = audioBuffer.getChannelData(channel);
          const newData = newBuffer.getChannelData(channel);
          for (let i = 0; i < newLength; i++) {
            newData[i] = oldData[startSample + i];
          }
        }

        const wavBlob = audioBufferToWav(newBuffer);
        resolve(wavBlob);
        audioContext.close();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};