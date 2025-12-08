# PDF Knife 📄🔪

A powerful client-side web application for merging, reordering, rotating, and editing PDF documents directly in your browser.

## Features

- **Upload Multiple PDFs**: Load one or more PDF files from your computer
- **Visual Page Preview**: See thumbnail previews of all pages in a clean grid layout
- **Drag & Drop Reordering**: Easily rearrange pages by dragging and dropping
- **Page Rotation**: Rotate individual pages in 90° increments
- **Rotate All Pages**: Rotate all pages at once with a single click
- **Page Deletion**: Remove unwanted pages from your document
- **Page Duplication**: Duplicate any page with one click
- **Insert Blank Pages**: Add blank pages anywhere in your document
- **Merge PDFs**: Combine multiple PDFs into a single document
- **Client-Side Processing**: All processing happens in your browser - no server upload required
- **Privacy-Focused**: Your PDFs never leave your computer
- **Ready for Web Hosting**: Deploy to GitHub Pages, Netlify, Vercel, or any static host

## Technologies Used

- **Vanilla HTML/CSS/JavaScript** - No frameworks required
- **PDF.js** - For rendering PDF thumbnails
- **pdf-lib** - For PDF assembly and manipulation

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ghostwillower/Pdf.git
cd Pdf
```

2. Install dependencies (optional, only if you need to rebuild):
```bash
npm install
```

3. Start a local web server:
```bash
# Using Python 3
python3 -m http.server 8080

# OR using Node.js
npx http-server -p 8080
```

4. Open your browser and navigate to:
```
http://localhost:8080
```

## Usage

1. **Upload PDFs**: Click the "📤 Upload PDFs" button and select one or more PDF files
2. **View Pages**: All pages from all PDFs will be displayed in a grid
3. **Reorder Pages**: Click and drag page cards to reorder them
4. **Rotate Pages**: Click the "🔄 Rotate" button on any page to rotate it 90° clockwise
5. **Duplicate Pages**: Click the "📋 Duplicate" button to create a copy of any page
6. **Delete Pages**: Click the "🗑️ Delete" button to remove a page
7. **Insert Blank Page**: Click "➕ Blank Page" to add a blank page at the end
8. **Rotate All**: Click "🔄 Rotate All" to rotate all pages 90° clockwise
9. **Clear All**: Click "🗑️ Clear All" to remove all loaded pages
10. **Download**: Click "⬇️ Download PDF" to save your edited PDF as `output.pdf`

## Deployment

PDF Knife is ready to be deployed as a website! It's a 100% client-side application with no backend requirements.

### Quick Deploy:

- **GitHub Pages**: Already configured with workflow in `.github/workflows/deploy.yml`
- **Netlify**: Configuration ready in `netlify.toml` - just connect your repo
- **Vercel**: Configuration ready in `vercel.json` - one-click deploy

📖 **[See Full Deployment Guide](DEPLOYMENT.md)** for detailed instructions on deploying to various platforms.

### Deploy Now:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Ghostwillower/Pdf)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ghostwillower/Pdf)

## File Structure

```
Pdf/
├── index.html          # Main HTML structure
├── style.css           # Styling and layout
├── script.js           # Application logic
├── lib/                # Third-party libraries
│   ├── pdf.min.mjs     # PDF.js library
│   ├── pdf.worker.min.mjs  # PDF.js worker
│   └── pdf-lib.min.js  # pdf-lib library
├── package.json        # NPM dependencies
└── README.md           # This file
```

## How It Works

1. **Loading PDFs**: When you upload PDFs, they are loaded into memory using both pdf.js (for rendering) and pdf-lib (for assembly)
2. **Thumbnails**: PDF.js renders each page as a canvas element for preview
3. **Page Management**: Each page is tracked in a JavaScript array with metadata (source, page number, rotation)
4. **Drag & Drop**: HTML5 Drag and Drop API enables reordering by manipulating the pages array
5. **Rotation**: CSS transforms rotate the thumbnails, and pdf-lib applies actual rotation during export
6. **Export**: pdf-lib creates a new PDF document, copies pages in the current order with rotations applied, and downloads it

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

## Screenshots

### Empty State
![Empty State](https://github.com/user-attachments/assets/b1992ad6-23af-4dcc-b721-92aa5689090c)

### Pages Loaded
![Pages Loaded](https://github.com/user-attachments/assets/1b119a32-c0f9-4f86-926f-864134f16ba3)

### After Rotation
![After Rotation](https://github.com/user-attachments/assets/5a6eca93-21b0-4d62-8457-718758d3475f)

### After Deletion
![After Deletion](https://github.com/user-attachments/assets/d13da247-1644-476b-a6da-785071bec87d)

## Privacy & Security

- **100% Client-Side**: All PDF processing happens in your browser
- **No Server Upload**: Your PDFs are never sent to any server
- **No Data Storage**: Nothing is stored or tracked
- **Offline Capable**: Works without internet after initial page load

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
