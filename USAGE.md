# PDF Knife - Quick Start Guide

## 🚀 Quick Start

1. **Start a web server:**
   ```bash
   python3 -m http.server 8080
   ```

2. **Open in browser:**
   ```
   http://localhost:8080
   ```

3. **Use the application:**
   - Click "Upload PDFs" to select PDF files
   - Drag pages to reorder them
   - Click "Rotate" to rotate a page 90°
   - Click "Delete" to remove a page
   - Click "Download PDF" to save your edited PDF

## 📖 Detailed Usage

### Uploading PDFs
- Click the "📤 Upload PDFs" button (in navbar or empty state)
- Select one or more PDF files from your computer
- Pages from all PDFs will be loaded and displayed

### Managing Pages
- **Reorder:** Click and drag a page card to move it
- **Rotate:** Click "🔄 Rotate" to rotate 90° clockwise (click multiple times for 180°, 270°)
- **Rotate All:** Click "🔄 Rotate All" in the navbar to rotate all pages at once
- **Duplicate:** Click "📋 Duplicate" to create a copy of any page
- **Delete:** Click "🗑️ Delete" to remove a page
- **Insert Blank Page:** Click "➕ Blank Page" to add a blank page at the end
- **Clear All:** Click "🗑️ Clear All" to remove all pages (confirms first)

### Keyboard Shortcuts
- **Ctrl/Cmd + S:** Download PDF
- **Ctrl/Cmd + R:** Rotate All Pages
- **Ctrl/Cmd + B:** Insert Blank Page
- **Ctrl/Cmd + Delete:** Clear All Pages
- **Escape:** Close Help Modal

### Downloading
- Click "⬇️ Download PDF" to create and download your edited PDF
- Or use **Ctrl/Cmd + S** keyboard shortcut
- The file will be saved as "output.pdf"
- All rotations and page order will be preserved

## 💡 Tips

- You can upload PDFs multiple times to add more pages
- Drag and drop works on desktop and mobile (with touch)
- All processing happens in your browser - no upload to servers
- Your original PDFs are never modified

## 🔒 Privacy

- 100% client-side processing
- No data sent to any server
- No tracking or storage
- Your PDFs stay on your computer

## 🐛 Troubleshooting

**Pages don't show thumbnails:**
- Wait a moment - large PDFs may take time to render
- Check browser console for errors

**Download doesn't work:**
- Make sure you have pages loaded
- Check if pop-ups are blocked
- Try a different browser

**Can't drag pages:**
- Make sure you're clicking and holding on the page card
- Try using a mouse instead of trackpad
