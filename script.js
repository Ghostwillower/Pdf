// Global variables
let pdfDoc = null;
let pageNum = 1;
let pageCount = 0;
let scale = 1.5;
let canvas = null;
let ctx = null;
let annotationCanvas = null;
let annotationCtx = null;
let isDrawing = false;
let currentTool = 'view';
let uploadedFiles = [];
let modifiedPdfBytes = null;

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('pdf-canvas');
    ctx = canvas.getContext('2d');
    annotationCanvas = document.getElementById('annotation-canvas');
    annotationCtx = annotationCanvas.getContext('2d');
    
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('pdf-upload');
    
    // File upload
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFileSelect({ target: { files: e.dataTransfer.files } });
    });
    
    // Annotation canvas events
    annotationCanvas.addEventListener('mousedown', startDrawing);
    annotationCanvas.addEventListener('mousemove', draw);
    annotationCanvas.addEventListener('mouseup', stopDrawing);
    annotationCanvas.addEventListener('mouseout', stopDrawing);
    annotationCanvas.addEventListener('click', handleCanvasClick);
}

// Handle file selection
function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    
    uploadedFiles = Array.from(files);
    
    if (uploadedFiles.length === 1) {
        loadPDF(uploadedFiles[0]);
    } else {
        showStatus('Multiple files selected. Use "Merge PDFs" to combine them.', 'info');
        showSection('tools');
    }
}

// Load PDF file
function loadPDF(file) {
    const fileReader = new FileReader();
    
    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);
        
        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            pdfDoc = pdf;
            pageCount = pdf.numPages;
            pageNum = 1;
            
            showSection('tools');
            showSection('editor');
            renderPage(pageNum);
            generateThumbnails();
            showStatus('PDF loaded successfully!', 'success');
        }).catch(function(error) {
            showStatus('Error loading PDF: ' + error.message, 'error');
        });
    };
    
    fileReader.readAsArrayBuffer(file);
}

// Render PDF page
function renderPage(num) {
    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({ scale: scale });
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        annotationCanvas.height = viewport.height;
        annotationCanvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        page.render(renderContext).promise.then(function() {
            updatePageInfo();
            document.getElementById('toolbar').classList.remove('hidden');
        });
    });
}

// Navigation functions
function nextPage() {
    if (pageNum >= pageCount) return;
    pageNum++;
    renderPage(pageNum);
    clearAnnotations();
}

function prevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
    clearAnnotations();
}

function updatePageInfo() {
    document.getElementById('page-info').textContent = `Page ${pageNum} of ${pageCount}`;
}

// Zoom functions
function zoomIn() {
    scale += 0.25;
    renderPage(pageNum);
    updateZoomLevel();
}

function zoomOut() {
    if (scale <= 0.5) return;
    scale -= 0.25;
    renderPage(pageNum);
    updateZoomLevel();
}

function updateZoomLevel() {
    document.getElementById('zoom-level').textContent = Math.round(scale * 100) + '%';
}

// Show specific tool
function showTool(tool) {
    currentTool = tool;
    clearAnnotations();
    
    // Hide all tool-specific UI
    document.getElementById('annotation-tools').classList.add('hidden');
    document.getElementById('text-tools').classList.add('hidden');
    document.getElementById('text-output').classList.add('hidden');
    document.getElementById('page-thumbnails').classList.add('hidden');
    
    // Update active button
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.tool-btn').classList.add('active');
    
    switch(tool) {
        case 'view':
            annotationCanvas.style.pointerEvents = 'none';
            break;
        case 'annotate':
            document.getElementById('annotation-tools').classList.remove('hidden');
            annotationCanvas.style.pointerEvents = 'auto';
            annotationCanvas.style.cursor = 'crosshair';
            break;
        case 'text':
            document.getElementById('text-tools').classList.remove('hidden');
            annotationCanvas.style.pointerEvents = 'auto';
            annotationCanvas.style.cursor = 'text';
            break;
        case 'draw':
            document.getElementById('annotation-tools').classList.remove('hidden');
            annotationCanvas.style.pointerEvents = 'auto';
            annotationCanvas.style.cursor = 'crosshair';
            break;
        case 'rotate':
            rotateCurrentPage();
            break;
        case 'delete':
            document.getElementById('page-thumbnails').classList.remove('hidden');
            showStatus('Click the X on thumbnails to delete pages', 'info');
            break;
        case 'merge':
            mergePDFs();
            break;
        case 'split':
            splitPDF();
            break;
        case 'extract':
            extractText();
            break;
    }
}

// Drawing functions
function startDrawing(e) {
    if (currentTool !== 'annotate' && currentTool !== 'draw') return;
    
    isDrawing = true;
    const rect = annotationCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    annotationCtx.beginPath();
    annotationCtx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing || (currentTool !== 'annotate' && currentTool !== 'draw')) return;
    
    const rect = annotationCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const color = document.getElementById('color-picker').value;
    const size = document.getElementById('size-slider').value;
    
    annotationCtx.strokeStyle = color;
    annotationCtx.lineWidth = size;
    annotationCtx.lineCap = 'round';
    annotationCtx.lineJoin = 'round';
    
    annotationCtx.lineTo(x, y);
    annotationCtx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function handleCanvasClick(e) {
    if (currentTool !== 'text') return;
    
    const rect = annotationCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const text = document.getElementById('text-input').value;
    const size = document.getElementById('text-size').value;
    const color = document.getElementById('color-picker').value;
    
    if (text) {
        annotationCtx.font = `${size}px Arial`;
        annotationCtx.fillStyle = color;
        annotationCtx.fillText(text, x, y);
    }
}

function clearAnnotations() {
    annotationCtx.clearRect(0, 0, annotationCanvas.width, annotationCanvas.height);
}

// Generate page thumbnails
function generateThumbnails() {
    const container = document.getElementById('page-thumbnails');
    container.innerHTML = '';
    
    for (let i = 1; i <= pageCount; i++) {
        const thumbDiv = document.createElement('div');
        thumbDiv.className = 'page-thumbnail';
        if (i === pageNum) thumbDiv.classList.add('active');
        
        const thumbCanvas = document.createElement('canvas');
        const pageNumber = document.createElement('div');
        pageNumber.className = 'page-number';
        pageNumber.textContent = `Page ${i}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-page';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deletePage(i);
        };
        
        thumbDiv.appendChild(thumbCanvas);
        thumbDiv.appendChild(pageNumber);
        thumbDiv.appendChild(deleteBtn);
        thumbDiv.onclick = () => {
            pageNum = i;
            renderPage(pageNum);
            updateThumbnailSelection();
        };
        
        container.appendChild(thumbDiv);
        
        // Render thumbnail
        pdfDoc.getPage(i).then(function(page) {
            const viewport = page.getViewport({ scale: 0.2 });
            thumbCanvas.height = viewport.height;
            thumbCanvas.width = viewport.width;
            
            page.render({
                canvasContext: thumbCanvas.getContext('2d'),
                viewport: viewport
            });
        });
    }
}

function updateThumbnailSelection() {
    document.querySelectorAll('.page-thumbnail').forEach((thumb, index) => {
        if (index + 1 === pageNum) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Rotate current page
async function rotateCurrentPage() {
    if (!pdfDoc) return;
    
    try {
        // Get original PDF bytes
        const arrayBuffer = await uploadedFiles[0].arrayBuffer();
        const pdfLibDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        
        const pages = pdfLibDoc.getPages();
        const page = pages[pageNum - 1];
        page.setRotation(PDFLib.degrees((page.getRotation().angle + 90) % 360));
        
        const pdfBytes = await pdfLibDoc.save();
        modifiedPdfBytes = pdfBytes;
        
        // Reload PDF
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const file = new File([blob], 'rotated.pdf', { type: 'application/pdf' });
        uploadedFiles[0] = file;
        loadPDF(file);
        
        showStatus('Page rotated successfully!', 'success');
    } catch (error) {
        showStatus('Error rotating page: ' + error.message, 'error');
    }
}

// Delete page
async function deletePage(pageIndex) {
    if (pageCount <= 1) {
        showStatus('Cannot delete the only page!', 'error');
        return;
    }
    
    if (!confirm(`Delete page ${pageIndex}?`)) return;
    
    try {
        const arrayBuffer = await uploadedFiles[0].arrayBuffer();
        const pdfLibDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        
        pdfLibDoc.removePage(pageIndex - 1);
        
        const pdfBytes = await pdfLibDoc.save();
        modifiedPdfBytes = pdfBytes;
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const file = new File([blob], 'modified.pdf', { type: 'application/pdf' });
        uploadedFiles[0] = file;
        loadPDF(file);
        
        showStatus('Page deleted successfully!', 'success');
    } catch (error) {
        showStatus('Error deleting page: ' + error.message, 'error');
    }
}

// Merge PDFs
async function mergePDFs() {
    if (uploadedFiles.length < 2) {
        showStatus('Please upload at least 2 PDF files to merge', 'error');
        return;
    }
    
    try {
        const mergedPdf = await PDFLib.PDFDocument.create();
        
        for (const file of uploadedFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        
        const pdfBytes = await mergedPdf.save();
        modifiedPdfBytes = pdfBytes;
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const file = new File([blob], 'merged.pdf', { type: 'application/pdf' });
        uploadedFiles = [file];
        loadPDF(file);
        
        showStatus('PDFs merged successfully!', 'success');
    } catch (error) {
        showStatus('Error merging PDFs: ' + error.message, 'error');
    }
}

// Split PDF
async function splitPDF() {
    if (!pdfDoc || pageCount <= 1) {
        showStatus('Need a PDF with multiple pages to split', 'error');
        return;
    }
    
    const splitPoint = prompt(`Split after page (1-${pageCount - 1}):`);
    if (!splitPoint || splitPoint < 1 || splitPoint >= pageCount) {
        showStatus('Invalid page number', 'error');
        return;
    }
    
    try {
        const arrayBuffer = await uploadedFiles[0].arrayBuffer();
        const originalPdf = await PDFLib.PDFDocument.load(arrayBuffer);
        
        // Create first PDF
        const pdf1 = await PDFLib.PDFDocument.create();
        const pages1 = await pdf1.copyPages(originalPdf, Array.from({ length: parseInt(splitPoint) }, (_, i) => i));
        pages1.forEach((page) => pdf1.addPage(page));
        const pdf1Bytes = await pdf1.save();
        
        // Create second PDF
        const pdf2 = await PDFLib.PDFDocument.create();
        const pages2 = await pdf2.copyPages(originalPdf, Array.from({ length: pageCount - splitPoint }, (_, i) => i + parseInt(splitPoint)));
        pages2.forEach((page) => pdf2.addPage(page));
        const pdf2Bytes = await pdf2.save();
        
        // Download both parts
        downloadBytes(pdf1Bytes, 'split_part1.pdf');
        downloadBytes(pdf2Bytes, 'split_part2.pdf');
        
        showStatus('PDF split successfully! Check your downloads.', 'success');
    } catch (error) {
        showStatus('Error splitting PDF: ' + error.message, 'error');
    }
}

// Extract text from PDF
async function extractText() {
    if (!pdfDoc) return;
    
    document.getElementById('text-output').classList.remove('hidden');
    const textarea = document.getElementById('extracted-text');
    textarea.value = 'Extracting text...';
    
    let fullText = '';
    
    for (let i = 1; i <= pageCount; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    }
    
    textarea.value = fullText;
    showStatus('Text extracted successfully!', 'success');
}

// Copy extracted text
function copyText() {
    const textarea = document.getElementById('extracted-text');
    textarea.select();
    document.execCommand('copy');
    showStatus('Text copied to clipboard!', 'success');
}

// Download PDF
async function downloadPDF() {
    if (!pdfDoc) {
        showStatus('No PDF loaded', 'error');
        return;
    }
    
    try {
        let pdfBytes;
        
        if (modifiedPdfBytes) {
            pdfBytes = modifiedPdfBytes;
        } else {
            const arrayBuffer = await uploadedFiles[0].arrayBuffer();
            pdfBytes = new Uint8Array(arrayBuffer);
        }
        
        downloadBytes(pdfBytes, 'edited.pdf');
        showStatus('PDF downloaded successfully!', 'success');
    } catch (error) {
        showStatus('Error downloading PDF: ' + error.message, 'error');
    }
}

// Helper function to download bytes
function downloadBytes(bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// Show/hide sections
function showSection(sectionId) {
    const section = document.getElementById(sectionId + '-section');
    if (section) {
        section.classList.remove('hidden');
    }
}

function hideSection(sectionId) {
    const section = document.getElementById(sectionId + '-section');
    if (section) {
        section.classList.add('hidden');
    }
}

// Show status message
function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 4000);
}
