# Universal File Converter

A modern, client-side file conversion tool that supports multiple file formats across documents, images, audio, and video. Built with React, TypeScript, and Tailwind CSS.

## 🎨 Features

### Multi-Format Support
- **Documents**: Markdown, PDF, DOCX, TXT, HTML, RTF
- **Images**: JPG, PNG, GIF, WEBP, BMP, SVG, ICO
- **Audio**: MP3, WAV, OGG, FLAC, AAC, M4A
- **Video**: MP4, WEBM, AVI, MOV, MKV, OGV

### Document Conversions
- Markdown → HTML, PDF, DOCX, TXT
- TXT → HTML, PDF, Markdown
- HTML → PDF, TXT

### Image Conversions
- Convert between all major image formats
- Resize images with aspect ratio preservation
- Adjust image quality and compression
- Client-side processing for privacy

### Audio Conversions
- Convert audio files to WAV format
- Extract audio metadata (duration, sample rate, channels)
- Web Audio API processing

### Video Conversions
- Extract video frames as images
- Create video thumbnails
- Get video metadata (duration, resolution, size)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/patriotnewsactivism/md-style-converter.git
cd md-style-converter

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
# or
bun run build
```

## 💡 Usage

1. **Select File Category**: Choose between Documents, Images, Audio, or Video
2. **Upload File**: Click or drag-and-drop your file
3. **Choose Target Format**: Select the desired output format
4. **Configure Options**: Adjust quality, dimensions, or other format-specific settings
5. **Convert & Download**: Click the convert button to process and download your file

## 🎨 Color Scheme

The application features a modern teal/cyan color scheme:
- Primary: Teal (HSL: 180, 75%, 45%)
- Accent: Cyan (HSL: 190, 85%, 50%)
- Supports both light and dark modes

## 🔒 Privacy & Security

All file conversions are performed **client-side** in your browser. Your files never leave your device, ensuring complete privacy and security.

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **html2pdf.js** - PDF generation
- **docx** - DOCX generation
- **Canvas API** - Image processing
- **Web Audio API** - Audio processing

## 📝 Supported Conversions

### Documents
| From | To |
|------|-----|
| Markdown | HTML, PDF, DOCX, TXT |
| TXT | HTML, PDF, Markdown |
| HTML | PDF, TXT |

### Images
| From | To |
|------|-----|
| JPG/JPEG | PNG, WEBP, BMP, GIF |
| PNG | JPG, WEBP, BMP, GIF |
| WEBP | JPG, PNG, BMP, GIF |
| GIF | JPG, PNG, WEBP, BMP |
| BMP | JPG, PNG, WEBP, GIF |

### Audio
| From | To |
|------|-----|
| MP3, WAV, OGG, M4A, AAC | WAV |

*Note: Browser-based audio conversion is limited. For advanced conversions, consider server-side solutions.*

### Video
| From | To |
|------|-----|
| MP4, WEBM, AVI, MOV, MKV | Frame extraction (JPG, PNG), Thumbnail |

*Note: Full video format conversion requires server-side processing. This tool can extract frames and create thumbnails.*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by the need for privacy-focused file conversion tools

## 🔮 Future Enhancements

- Server-side processing option for advanced conversions
- Batch file conversion
- Cloud storage integration
- More audio/video format support via FFmpeg.wasm
- PDF editing capabilities
- OCR for image-to-text conversion

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for privacy-conscious users**