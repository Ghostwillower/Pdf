# 📄 PDF Editor - Free Online PDF Tools

A comprehensive, browser-based PDF editor with full functionality for viewing, editing, annotating, merging, splitting, and more. All processing happens locally in your browser - no files are uploaded to any server, ensuring complete privacy.

## 🌟 Features

### View & Navigate
- **PDF Viewer**: High-quality PDF rendering
- **Navigation**: Easy page-by-page navigation
- **Zoom Controls**: Zoom in/out for better viewing
- **Page Thumbnails**: Quick page overview and navigation

### Edit & Annotate
- **Draw/Annotate**: Freehand drawing on PDFs with customizable colors and sizes
- **Add Text**: Insert text anywhere on the PDF with custom size and color
- **Rotate Pages**: Rotate individual pages 90° at a time
- **Delete Pages**: Remove unwanted pages from your PDF

### Advanced Tools
- **Merge PDFs**: Combine multiple PDF files into one
- **Split PDF**: Divide a PDF into separate documents
- **Extract Text**: Extract all text content from the PDF
- **Download**: Save your edited PDF with all modifications

## 🚀 Getting Started

### Option 1: Open Locally
1. Download all files (`index.html`, `styles.css`, `script.js`)
2. Open `index.html` in a modern web browser
3. Start editing PDFs!

### Option 2: Host on a Web Server

#### Using GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Select the main branch as source
4. Your PDF editor will be live at `https://yourusername.github.io/Pdf/`

#### Using Netlify
1. Sign up at [Netlify](https://www.netlify.com)
2. Drag and drop the folder or connect your GitHub repository
3. Deploy! Your site will be live instantly

#### Using Vercel
1. Sign up at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Deploy with zero configuration

#### Using a Simple HTTP Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

## 📖 How to Use

### Upload a PDF
1. Click "Choose PDF File(s)" or drag & drop PDF files onto the upload area
2. For a single file: it loads automatically
3. For multiple files: use the "Merge PDFs" tool to combine them

### View PDF
1. Click the "View PDF" tool
2. Use Previous/Next buttons to navigate
3. Use +/- buttons to zoom

### Annotate
1. Click the "Annotate" tool
2. Choose your color and line size
3. Draw directly on the PDF

### Add Text
1. Click the "Add Text" tool
2. Enter your text in the input field
3. Set font size and color
4. Click anywhere on the PDF to place the text

### Rotate Pages
1. Navigate to the page you want to rotate
2. Click the "Rotate Pages" tool
3. The current page rotates 90° clockwise

### Delete Pages
1. Click the "Delete Pages" tool
2. Page thumbnails will appear
3. Click the X button on any thumbnail to delete that page

### Merge PDFs
1. Upload multiple PDF files
2. Click the "Merge PDFs" tool
3. All files will be combined into one

### Split PDF
1. Load a multi-page PDF
2. Click the "Split PDF" tool
3. Enter the page number where you want to split
4. Two separate PDFs will be downloaded

### Extract Text
1. Click the "Extract Text" tool
2. All text from the PDF will be displayed
3. Click "Copy Text" to copy to clipboard

### Download
1. Click the "Download" button
2. Your edited PDF will be saved to your device

## 🔒 Privacy & Security

- **100% Client-Side**: All PDF processing happens in your browser
- **No Server Upload**: Your files never leave your device
- **No Data Collection**: We don't collect or store any data
- **Safe & Secure**: Your documents remain completely private

## 🛠️ Technologies Used

- **PDF.js**: Mozilla's PDF rendering library
- **PDF-Lib**: PDF manipulation and editing
- **Vanilla JavaScript**: No heavy frameworks
- **Modern CSS**: Responsive and beautiful design
- **HTML5 Canvas**: For annotations and rendering

## 🌐 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Mobile Support

The PDF editor is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available under the MIT License.

## 🎯 Roadmap

Future enhancements planned:
- [ ] Add signatures
- [ ] Watermark support
- [ ] Form filling
- [ ] PDF compression
- [ ] More annotation tools
- [ ] Undo/Redo functionality
- [ ] Multiple annotation layers

## 💡 Tips

- For best results, use PDFs that are not scanned images
- Larger PDFs may take longer to process
- Annotations are rendered as overlays - download to save them permanently
- Use Chrome or Firefox for the best experience

## 🐛 Troubleshooting

**PDF not loading?**
- Ensure the PDF is not corrupted
- Try a different browser
- Check browser console for errors

**Features not working?**
- Make sure JavaScript is enabled
- Update to the latest browser version
- Clear browser cache

**Slow performance?**
- Large PDFs may take time to process
- Close other browser tabs to free up memory
- Try reducing zoom level

---

Made with ❤️ for everyone who needs to edit PDFs without uploading them to unknown servers.