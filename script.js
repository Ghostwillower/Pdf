// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Global state
let pages = []; // Array of page objects: {id, sourceIndex, pageNumber, rotation, pdfDoc}
let loadedPDFs = []; // Array of loaded PDFDocument objects from pdf-lib
let nextId = 0;

// DOM Elements
const uploadInput = document.getElementById('pdf-upload');
const uploadInputEmpty = document.getElementById('pdf-upload-empty');
const clearAllBtn = document.getElementById('clear-all');
const downloadBtn = document.getElementById('download-pdf');
const pagesContainer = document.getElementById('pages-container');
const emptyState = document.getElementById('empty-state');

// Event Listeners
uploadInput.addEventListener('change', handleFileUpload);
uploadInputEmpty.addEventListener('change', handleFileUpload);
clearAllBtn.addEventListener('click', clearAll);
downloadBtn.addEventListener('click', downloadPDF);

// Handle file upload
async function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    // Show loading state
    showLoading();

    try {
        for (const file of files) {
            await loadPDF(file);
        }
        renderPages();
        updateUI();
    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF files. Please try again.');
    } finally {
        // Reset file input
        event.target.value = '';
        hideLoading();
    }
}

// Load a PDF file
async function loadPDF(file) {
    try {
        // Read file as array buffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load with pdf-lib for later assembly
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const sourceIndex = loadedPDFs.length;
        loadedPDFs.push(pdfDoc);

        // Load with pdf.js for rendering thumbnails
        const pdfjsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdfjsDoc.numPages;

        // Add all pages to the pages array
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdfjsDoc.getPage(pageNum);
            const thumbnail = await generateThumbnail(page);
            
            pages.push({
                id: nextId++,
                sourceIndex: sourceIndex,
                pageNumber: pageNum,
                rotation: 0,
                pdfDoc: pdfDoc,
                thumbnail: thumbnail,
                pdfjsPage: page
            });
        }
    } catch (error) {
        console.error('Error loading PDF:', error);
        throw error;
    }
}

// Generate thumbnail from pdf.js page
async function generateThumbnail(page) {
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };

    await page.render(renderContext).promise;
    return canvas;
}

// Render all pages
function renderPages() {
    pagesContainer.innerHTML = '';

    pages.forEach((page, index) => {
        const card = createPageCard(page, index);
        pagesContainer.appendChild(card);
    });

    setupDragAndDrop();
}

// Create a page card element
function createPageCard(page, index) {
    const card = document.createElement('div');
    card.className = 'page-card';
    card.draggable = true;
    card.dataset.pageId = page.id;
    card.dataset.index = index;

    // Thumbnail container
    const thumbnailContainer = document.createElement('div');
    thumbnailContainer.className = `thumbnail-container rotate-${page.rotation}`;
    
    // Clone the canvas for display
    const thumbnailCanvas = page.thumbnail.cloneNode(true);
    thumbnailContainer.appendChild(thumbnailCanvas);

    // Page info
    const pageInfo = document.createElement('div');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Page ${index + 1}`;

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'page-actions';

    const rotateBtn = document.createElement('button');
    rotateBtn.className = 'btn-rotate';
    rotateBtn.textContent = '🔄 Rotate';
    rotateBtn.onclick = (e) => {
        e.stopPropagation();
        rotatePage(page.id);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = '🗑️ Delete';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deletePage(page.id);
    };

    actions.appendChild(rotateBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(thumbnailContainer);
    card.appendChild(pageInfo);
    card.appendChild(actions);

    return card;
}

// Setup drag and drop
function setupDragAndDrop() {
    const cards = document.querySelectorAll('.page-card');

    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragenter', handleDragEnter);
        card.addEventListener('dragleave', handleDragLeave);
        card.addEventListener('dragend', handleDragEnd);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    this.classList.remove('drag-over');

    if (draggedElement !== this) {
        const fromIndex = parseInt(draggedElement.dataset.index);
        const toIndex = parseInt(this.dataset.index);

        // Reorder pages array
        const movedPage = pages.splice(fromIndex, 1)[0];
        pages.splice(toIndex, 0, movedPage);

        renderPages();
    }

    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    const cards = document.querySelectorAll('.page-card');
    cards.forEach(card => {
        card.classList.remove('drag-over');
    });
}

// Rotate page
function rotatePage(pageId) {
    const page = pages.find(p => p.id === pageId);
    if (page) {
        page.rotation = (page.rotation + 90) % 360;
        renderPages();
    }
}

// Delete page
function deletePage(pageId) {
    pages = pages.filter(p => p.id !== pageId);
    renderPages();
    updateUI();
}

// Clear all pages
function clearAll() {
    if (pages.length === 0) return;
    
    if (confirm('Are you sure you want to clear all pages?')) {
        pages = [];
        loadedPDFs = [];
        nextId = 0;
        renderPages();
        updateUI();
    }
}

// Download combined PDF
async function downloadPDF() {
    if (pages.length === 0) {
        alert('No pages to download. Please upload PDFs first.');
        return;
    }

    try {
        showLoading();

        // Create new PDF document
        const pdfDoc = await PDFLib.PDFDocument.create();

        // Copy each page from source PDFs
        for (const page of pages) {
            // Copy the page from the source PDF
            const [copiedPage] = await pdfDoc.copyPages(page.pdfDoc, [page.pageNumber - 1]);
            
            // Apply rotation if needed
            if (page.rotation !== 0) {
                copiedPage.setRotation(PDFLib.degrees(page.rotation));
            }

            // Add the page to the new document
            pdfDoc.addPage(copiedPage);
        }

        // Serialize the PDF to bytes
        const pdfBytes = await pdfDoc.save();

        // Create download link
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'output.pdf';
        link.click();

        // Clean up
        URL.revokeObjectURL(url);

        hideLoading();
    } catch (error) {
        console.error('Error creating PDF:', error);
        alert('Error creating PDF. Please try again.');
        hideLoading();
    }
}

// Update UI visibility
function updateUI() {
    if (pages.length === 0) {
        emptyState.style.display = 'block';
        pagesContainer.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        pagesContainer.style.display = 'grid';
    }
}

// Show loading indicator
function showLoading() {
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<span class="loading"></span> Processing...';
}

// Hide loading indicator
function hideLoading() {
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '⬇️ Download PDF';
}

// Initialize
updateUI();
