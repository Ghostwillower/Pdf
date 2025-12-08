// Import PDF.js as ES module
import * as pdfjsLib from './lib/pdf.min.mjs';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = './lib/pdf.worker.min.mjs';

// Access pdf-lib from window (loaded via script tag)
const { PDFDocument, degrees } = window.PDFLib;

// Global state
let pages = []; // Array of page objects: {id, sourceIndex, pageNumber, rotation, pdfDoc}
let loadedPDFs = []; // Array of loaded PDFDocument objects from pdf-lib
let nextId = 0;
let selectedPages = new Set(); // Track selected pages for batch operations
let selectionMode = false; // Toggle selection mode

// DOM Elements
const uploadInput = document.getElementById('pdf-upload');
const uploadInputEmpty = document.getElementById('pdf-upload-empty');
const clearAllBtn = document.getElementById('clear-all');
const downloadBtn = document.getElementById('download-pdf');
const insertBlankBtn = document.getElementById('insert-blank');
const rotateAllBtn = document.getElementById('rotate-all');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const adModal = document.getElementById('ad-modal');
const downloadNowBtn = document.getElementById('download-now-btn');
const pagesContainer = document.getElementById('pages-container');
const emptyState = document.getElementById('empty-state');

// Event Listeners
uploadInput.addEventListener('change', handleFileUpload);
uploadInputEmpty.addEventListener('change', handleFileUpload);
clearAllBtn.addEventListener('click', clearAll);
downloadBtn.addEventListener('click', downloadPDF);
insertBlankBtn.addEventListener('click', insertBlankPage);
rotateAllBtn.addEventListener('click', rotateAllPages);
helpBtn.addEventListener('click', showHelpModal);

// Keyboard shortcuts
document.addEventListener('keydown', handleKeyboardShortcuts);

// Help modal handlers
helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal || e.target.className === 'close') {
        hideHelpModal();
    }
});

// Ad modal handler
downloadNowBtn.addEventListener('click', proceedWithDownload);

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
        const pdfDoc = await PDFDocument.load(arrayBuffer);
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
    card.tabIndex = 0; // Make focusable for keyboard navigation

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

    const moveUpBtn = document.createElement('button');
    moveUpBtn.className = 'btn-move-up';
    moveUpBtn.textContent = '⬆️';
    moveUpBtn.title = 'Move Up';
    moveUpBtn.onclick = (e) => {
        e.stopPropagation();
        movePageUp(page.id);
    };
    if (index === 0) {
        moveUpBtn.disabled = true;
        moveUpBtn.style.opacity = '0.5';
    }

    const moveDownBtn = document.createElement('button');
    moveDownBtn.className = 'btn-move-down';
    moveDownBtn.textContent = '⬇️';
    moveDownBtn.title = 'Move Down';
    moveDownBtn.onclick = (e) => {
        e.stopPropagation();
        movePageDown(page.id);
    };
    if (index === pages.length - 1) {
        moveDownBtn.disabled = true;
        moveDownBtn.style.opacity = '0.5';
    }

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

    const duplicateBtn = document.createElement('button');
    duplicateBtn.className = 'btn-duplicate';
    duplicateBtn.textContent = '📋 Duplicate';
    duplicateBtn.onclick = (e) => {
        e.stopPropagation();
        duplicatePage(page.id);
    };

    actions.appendChild(moveUpBtn);
    actions.appendChild(moveDownBtn);
    actions.appendChild(rotateBtn);
    actions.appendChild(duplicateBtn);
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

// Move page up
function movePageUp(pageId) {
    const index = pages.findIndex(p => p.id === pageId);
    if (index > 0) {
        // Swap with previous page
        const temp = pages[index];
        pages[index] = pages[index - 1];
        pages[index - 1] = temp;
        renderPages();
    }
}

// Move page down
function movePageDown(pageId) {
    const index = pages.findIndex(p => p.id === pageId);
    if (index >= 0 && index < pages.length - 1) {
        // Swap with next page
        const temp = pages[index];
        pages[index] = pages[index + 1];
        pages[index + 1] = temp;
        renderPages();
    }
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

// Duplicate page
async function duplicatePage(pageId) {
    const pageIndex = pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;
    
    const originalPage = pages[pageIndex];
    
    // Create a duplicate with a new ID but same properties
    const duplicatePage = {
        ...originalPage,
        id: nextId++
    };
    
    // Insert after the original page
    pages.splice(pageIndex + 1, 0, duplicatePage);
    renderPages();
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

// Insert blank page at the end
async function insertBlankPage() {
    try {
        showLoading();
        
        // Create a new PDF with a blank page
        const blankPdf = await PDFDocument.create();
        const blankPage = blankPdf.addPage([612, 792]); // US Letter size
        
        // Store the blank PDF
        const sourceIndex = loadedPDFs.length;
        loadedPDFs.push(blankPdf);
        
        // Create a canvas for the blank page thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = 306; // Half of 612
        canvas.height = 396; // Half of 792
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#e0e0e0';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Add text to indicate it's a blank page
        ctx.fillStyle = '#cccccc';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Blank Page', canvas.width / 2, canvas.height / 2);
        
        // Add the blank page to pages array
        pages.push({
            id: nextId++,
            sourceIndex: sourceIndex,
            pageNumber: 1,
            rotation: 0,
            pdfDoc: blankPdf,
            thumbnail: canvas,
            pdfjsPage: null
        });
        
        renderPages();
        updateUI();
        hideLoading();
    } catch (error) {
        console.error('Error creating blank page:', error);
        alert('Error creating blank page. Please try again.');
        hideLoading();
    }
}

// Rotate all pages
function rotateAllPages() {
    if (pages.length === 0) {
        alert('No pages to rotate. Please upload PDFs first.');
        return;
    }
    
    pages.forEach(page => {
        page.rotation = (page.rotation + 90) % 360;
    });
    renderPages();
}

// Download combined PDF
async function downloadPDF() {
    if (pages.length === 0) {
        alert('No pages to download. Please upload PDFs first.');
        return;
    }

    // Show ad modal with countdown
    showAdModal();
}

// Show ad modal and start countdown
function showAdModal() {
    adModal.style.display = 'flex';
    downloadNowBtn.disabled = true;
    
    let timeLeft = 30;
    const countdownElement = document.getElementById('countdown');
    const timerSeconds = document.getElementById('timer-seconds');
    const timerBar = document.getElementById('timer-bar');
    
    // Update initial display
    countdownElement.textContent = timeLeft;
    timerSeconds.textContent = timeLeft;
    timerBar.style.width = '0%';
    
    // Push AdSense ads (if not already pushed)
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.log('AdSense not loaded or already initialized');
    }
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        timerSeconds.textContent = timeLeft;
        
        // Update progress bar
        const progress = ((30 - timeLeft) / 30) * 100;
        timerBar.style.width = progress + '%';
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            downloadNowBtn.disabled = false;
            downloadNowBtn.textContent = '✅ Download PDF Now!';
            timerSeconds.textContent = '0';
            countdownElement.textContent = '0';
            timerBar.style.width = '100%';
        }
    }, 1000);
}

// Hide ad modal
function hideAdModal() {
    adModal.style.display = 'none';
    downloadNowBtn.disabled = true;
    downloadNowBtn.textContent = '⬇️ Download PDF';
}

// Proceed with actual download after ad
async function proceedWithDownload() {
    if (downloadNowBtn.disabled) return;
    
    hideAdModal();

    try {
        showLoading();

        // Create new PDF document
        const pdfDoc = await PDFDocument.create();

        // Copy each page from source PDFs
        for (const page of pages) {
            // Copy the page from the source PDF
            const [copiedPage] = await pdfDoc.copyPages(page.pdfDoc, [page.pageNumber - 1]);
            
            // Apply rotation if needed
            if (page.rotation !== 0) {
                copiedPage.setRotation(degrees(page.rotation));
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

// Keyboard shortcuts handler
function handleKeyboardShortcuts(e) {
    // Don't trigger shortcuts when typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    // Ctrl/Cmd + S: Download PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        downloadPDF();
    }
    
    // Ctrl/Cmd + R: Rotate All
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        rotateAllPages();
    }
    
    // Ctrl/Cmd + B: Insert Blank Page
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        insertBlankPage();
    }
    
    // Delete/Backspace: Clear all (with confirmation)
    if ((e.key === 'Delete' || e.key === 'Backspace') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        clearAll();
    }
    
    // Escape: Close modal
    if (e.key === 'Escape') {
        hideHelpModal();
    }
    
    // Arrow Up: Move focused page up (with Ctrl/Cmd modifier)
    if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
        e.preventDefault();
        const activeCard = document.activeElement;
        if (activeCard && activeCard.classList.contains('page-card')) {
            const pageId = parseInt(activeCard.dataset.pageId);
            const currentIndex = pages.findIndex(p => p.id === pageId);
            if (currentIndex > 0) {
                movePageUp(pageId);
                // Re-focus the page after move
                setTimeout(() => {
                    const newIndex = currentIndex - 1;
                    const cards = document.querySelectorAll('.page-card');
                    if (cards[newIndex]) {
                        cards[newIndex].focus();
                    }
                }, 50);
            }
        }
    }
    
    // Arrow Down: Move focused page down (with Ctrl/Cmd modifier)
    if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowDown') {
        e.preventDefault();
        const activeCard = document.activeElement;
        if (activeCard && activeCard.classList.contains('page-card')) {
            const pageId = parseInt(activeCard.dataset.pageId);
            const currentIndex = pages.findIndex(p => p.id === pageId);
            if (currentIndex >= 0 && currentIndex < pages.length - 1) {
                movePageDown(pageId);
                // Re-focus the page after move
                setTimeout(() => {
                    const newIndex = currentIndex + 1;
                    const cards = document.querySelectorAll('.page-card');
                    if (cards[newIndex]) {
                        cards[newIndex].focus();
                    }
                }, 50);
            }
        }
    }
}

// Show help modal
function showHelpModal() {
    helpModal.style.display = 'flex';
}

// Hide help modal
function hideHelpModal() {
    helpModal.style.display = 'none';
}

// Initialize
updateUI();
