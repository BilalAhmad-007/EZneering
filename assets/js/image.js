// Image Tools JavaScript - Basic functionality

// Image Converter Functions
function convertImage() {
    const imageFile = window.selectedImageFile || document.getElementById('image-file').files[0];
    const targetFormat = document.getElementById('target-format').value;
    const preserveQuality = document.getElementById('preserve-quality').checked;
    const maintainTransparency = document.getElementById('maintain-transparency').checked;
    const result = document.getElementById('conversion-result');
    const errorDiv = document.getElementById('conversion-error');
    const loadingDiv = document.getElementById('conversion-loading');

    result.innerHTML = '';
    errorDiv.style.display = 'none';
    loadingDiv.style.display = 'block';
    errorDiv.textContent = '';

    if (!imageFile) {
        loadingDiv.style.display = 'none';
        errorDiv.textContent = 'Please select an image file.';
        errorDiv.style.display = 'block';
        return;
    }

    // Detect source format
    const fileType = imageFile.type;
    const fileExt = imageFile.name.split('.').pop().toLowerCase();
    let sourceFormat = fileType.split('/')[1] || fileExt;
    if (sourceFormat === 'jpeg') sourceFormat = 'jpg';
    if (targetFormat === sourceFormat) {
        loadingDiv.style.display = 'none';
        errorDiv.textContent = 'Source and target formats are the same.';
        errorDiv.style.display = 'block';
        return;
    }

    // Only support conversion for image types supported by canvas
    const supported = ['png', 'jpg', 'jpeg', 'webp'];
    if (!supported.includes(sourceFormat) && !supported.includes(targetFormat)) {
        loadingDiv.style.display = 'none';
        errorDiv.textContent = 'Unsupported format. Please use PNG, JPG, or WebP.';
        errorDiv.style.display = 'block';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new window.Image();
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                let mimeType = 'image/png';
                if (targetFormat === 'jpg' || targetFormat === 'jpeg') mimeType = 'image/jpeg';
                else if (targetFormat === 'webp') mimeType = 'image/webp';
                // GIF not supported by canvas, fallback to PNG
                else if (targetFormat === 'gif') mimeType = 'image/png';
                let quality = preserveQuality ? 0.92 : 0.7;
                let dataUrl = canvas.toDataURL(mimeType, quality);
                // Create download link and preview
                let downloadName = imageFile.name.replace(/\.[^.]+$/, '') + '.' + (targetFormat === 'jpg' ? 'jpg' : targetFormat);
                let preview = `<img src="${dataUrl}" alt="Converted Preview" style="max-width:220px;max-height:180px;display:block;margin:0 auto 1.2em auto;border-radius:0.5em;box-shadow:0 2px 8px #0001;">`;
                let downloadBtn = `<a href="${dataUrl}" download="${downloadName}" class="btn btn-primary" style="display:block;margin:0 auto 1em auto;max-width:220px;">Download Converted Image</a>`;
                let info = `<div style="margin-top:0.5em;font-size:0.95em;color:#888;text-align:center;">Converted from ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}<br>File: ${downloadName}</div>`;
                result.innerHTML = preview + downloadBtn + info;
                loadingDiv.style.display = 'none';
            } catch (err) {
                loadingDiv.style.display = 'none';
                errorDiv.textContent = 'Conversion failed. ' + err.message;
                errorDiv.style.display = 'block';
            }
        };
        img.onerror = function() {
            loadingDiv.style.display = 'none';
            errorDiv.textContent = 'Invalid image file.';
            errorDiv.style.display = 'block';
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        loadingDiv.style.display = 'none';
        errorDiv.textContent = 'Failed to read image file.';
        errorDiv.style.display = 'block';
    };
    reader.readAsDataURL(imageFile);
}

// Drag-and-drop and browse support
function setupImageConverterUI() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('image-file');
    const selectBtn = document.getElementById('select-image-btn');
    const result = document.getElementById('conversion-result');
    const errorDiv = document.getElementById('conversion-error');
    const loadingDiv = document.getElementById('conversion-loading');
    const fileNameDiv = document.getElementById('selected-file-name');

    if (!dropArea || !fileInput || !selectBtn) return;

    // Button click triggers file input
    selectBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag events
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });
    dropArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
    });
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            fileInput.files = files;
            window.selectedImageFile = files[0];
            result.innerHTML = '';
            errorDiv.style.display = 'none';
            loadingDiv.style.display = 'none';
            dropArea.classList.add('file-selected');
            if (fileNameDiv) {
                fileNameDiv.textContent = files[0].name;
                fileNameDiv.style.display = '';
            }
        }
    });
    // File input change
    fileInput.addEventListener('change', function() {
        if (fileInput.files && fileInput.files[0]) {
            window.selectedImageFile = fileInput.files[0];
            result.innerHTML = '';
            errorDiv.style.display = 'none';
            loadingDiv.style.display = 'none';
            dropArea.classList.add('file-selected');
            if (fileNameDiv) {
                fileNameDiv.textContent = fileInput.files[0].name;
                fileNameDiv.style.display = '';
            }
        }
    });
}

// Hide/show transparency option based on target format
function setupTransparencyOption() {
    const targetFormat = document.getElementById('target-format');
    const transparencyOption = document.getElementById('transparency-option');
    if (!targetFormat || !transparencyOption) return;
    function updateTransparency() {
        const val = targetFormat.value;
        if (val === 'png' || val === 'webp') {
            transparencyOption.style.display = '';
        } else {
            transparencyOption.style.display = 'none';
        }
    }
    targetFormat.addEventListener('change', updateTransparency);
    updateTransparency();
}

// Image Resizer Functions
function resizeImage() {
    const imageFile = window.selectedResizeImageFile || document.getElementById('resize-file').files[0];
    const widthInput = document.getElementById('resize-width').value;
    const heightInput = document.getElementById('resize-height').value;
    const maintainAspect = document.getElementById('maintain-aspect').checked;
    const result = document.getElementById('resize-result');
    result.innerHTML = '';

    // Error area
    let errorDiv = document.getElementById('resize-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'resize-error';
        errorDiv.className = 'error-message';
        errorDiv.style.marginBottom = '1em';
        result.parentNode.insertBefore(errorDiv, result);
    }
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    if (!imageFile) {
        errorDiv.textContent = 'Please select an image file.';
        errorDiv.style.display = 'block';
        return;
    }
    if (!widthInput && !heightInput) {
        errorDiv.textContent = 'Please enter at least width or height.';
        errorDiv.style.display = 'block';
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new window.Image();
        img.onload = function() {
            let origW = img.width, origH = img.height;
            let width = parseInt(widthInput);
            let height = parseInt(heightInput);
            if (maintainAspect) {
                if (width && !height) {
                    height = Math.round(origH * (width / origW));
                } else if (!width && height) {
                    width = Math.round(origW * (height / origH));
                } else if (width && height) {
                    // Fit within box, maintaining aspect
                    let ratio = Math.min(width / origW, height / origH);
                    width = Math.round(origW * ratio);
                    height = Math.round(origH * ratio);
                }
            } else {
                if (!width) width = origW;
                if (!height) height = origH;
            }
            // Clamp to minimum 1px
            width = Math.max(1, width);
            height = Math.max(1, height);
            // Resize using canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            // Use original format for output
            let fileType = imageFile.type || 'image/png';
            let ext = fileType.split('/')[1] || 'png';
            if (ext === 'jpeg') ext = 'jpg';
            let dataUrl = canvas.toDataURL(fileType, 0.92);
            let downloadName = imageFile.name.replace(/\.[^.]+$/, '') + `-resized.${ext}`;
            let preview = `<img src="${dataUrl}" alt="Resized Preview" style="max-width:220px;max-height:180px;display:block;margin:0 auto 1.2em auto;border-radius:0.5em;box-shadow:0 2px 8px #0001;">`;
            let downloadBtn = `<a href="${dataUrl}" download="${downloadName}" class="btn btn-primary" style="display:block;margin:0 auto 1em auto;max-width:220px;">Download Resized Image</a>`;
            let info = `<div style="margin-top:0.5em;font-size:0.95em;color:#888;text-align:center;">Original: ${origW} x ${origH}<br>New Size: ${width} x ${height}<br>File: ${downloadName}</div>`;
            result.innerHTML = preview + downloadBtn + info;
        };
        img.onerror = function() {
            errorDiv.textContent = 'Invalid image file.';
            errorDiv.style.display = 'block';
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        errorDiv.textContent = 'Failed to read image file.';
        errorDiv.style.display = 'block';
    };
    reader.readAsDataURL(imageFile);
}

// Image Compressor Functions
function compressImage() {
    const imageFile = window.selectedCompressImageFile || document.getElementById('compress-file').files[0];
    const quality = document.getElementById('compression-quality').value;
    const maxFileSize = document.getElementById('max-file-size').value;
    const result = document.getElementById('compression-result');
    result.innerHTML = '';
    // Error area
    let errorDiv = document.getElementById('compress-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'compress-error';
        errorDiv.className = 'error-message';
        errorDiv.style.marginBottom = '1em';
        result.parentNode.insertBefore(errorDiv, result);
    }
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    if (!imageFile) {
        errorDiv.textContent = 'Please select an image file.';
        errorDiv.style.display = 'block';
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new window.Image();
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                // Only support compressing to JPEG/WEBP/PNG
                let fileType = imageFile.type || 'image/jpeg';
                let ext = fileType.split('/')[1] || 'jpg';
                if (ext === 'jpeg' || ext === 'jpg') fileType = 'image/jpeg';
                else if (ext === 'webp') fileType = 'image/webp';
                else fileType = 'image/png';
                // Map compression level: higher = more compression (lower quality)
                // Compression Level 1 = quality 1.0 (least compression), Level 100 = quality 0.1 (most compression)
                let q = 1.0 - ((quality - 1) / 99) * 0.9; // Maps 1-100 to 1.0-0.1
                q = Math.max(0.1, Math.min(1, q));
                let dataUrl = canvas.toDataURL(fileType, q);
                // Calculate sizes
                let originalSize = imageFile.size / 1024;
                let compressedSize = dataUrl.length * 0.75 / 1024;
                originalSize = isFinite(originalSize) ? originalSize : 0;
                compressedSize = isFinite(compressedSize) ? compressedSize : 0;
                let reduction = 0;
                if (originalSize > 0 && compressedSize > 0 && compressedSize < originalSize) {
                    reduction = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);
                } else {
                    reduction = '0.0';
                }
                let reductionText = parseFloat(reduction) > 0 ? `Size Reduction: ${reduction}%` : 'No reduction';
                let downloadName = imageFile.name.replace(/\.[^.]+$/, '') + `-compressed.${ext}`;
                let preview = `<img src="${dataUrl}" alt="Compressed Preview" style="max-width:220px;max-height:180px;display:block;margin:0 auto 1.2em auto;border-radius:0.5em;box-shadow:0 2px 8px #0001;">`;
                let downloadBtn = `<a href="${dataUrl}" download="${downloadName}" class="btn btn-primary" style="display:block;margin:0 auto 1em auto;max-width:220px;">Download Compressed Image</a>`;
                let info = `<div style="margin-top:0.5em;font-size:0.95em;color:#888;text-align:center;">Original Size: ${originalSize.toFixed(2)} KB<br>Compressed Size: ${compressedSize.toFixed(2)} KB<br>${reductionText}<br>Compression Level: ${quality}<br>File: ${downloadName}</div>`;
                let warning = '';
                if (fileType === 'image/png' && (imageFile.type === 'image/png' || ext === 'png')) {
                    warning = `<div style="color:#eab308;font-weight:600;margin-bottom:1em;text-align:center;">Warning: PNG is a lossless format and may not compress. For better compression, use JPEG or WebP.</div>`;
                }
                result.innerHTML = warning + preview + downloadBtn + info;
            } catch (err) {
                errorDiv.textContent = 'Compression failed. ' + err.message;
                errorDiv.style.display = 'block';
            }
        };
        img.onerror = function() {
            errorDiv.textContent = 'Invalid image file.';
            errorDiv.style.display = 'block';
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        errorDiv.textContent = 'Failed to read image file.';
        errorDiv.style.display = 'block';
    };
    reader.readAsDataURL(imageFile);
}

// Image Cropper Functions
function cropImage() {
    const imageFile = document.getElementById('crop-file').files[0];
    const width = document.getElementById('crop-width').value;
    const height = document.getElementById('crop-height').value;
    const cropMode = document.querySelector('input[name="crop-mode"]:checked').value;

    if (!imageFile) {
        alert('Please select an image file.');
        return;
    }

    if (cropMode === 'fixed' && (!width || !height)) {
        alert('Please enter both width and height for fixed crop mode.');
        return;
    }

    // Simulate cropping process
    const result = document.getElementById('crop-result');
    const cropInfo = cropMode === 'fixed' ? 
        `Fixed crop to ${width} x ${height} pixels` : 
        'Free-form crop applied';

    result.innerHTML = `
        <div class="success-message">
            <h4>Image Cropped Successfully!</h4>
            <p>${cropInfo}</p>
            <p>File: ${imageFile.name}</p>
            <button class="btn btn-primary" onclick="downloadCroppedImage()">Download Cropped Image</button>
        </div>
    `;
}

// QR Code Generator Functions
function setupQRCodeUI() {
    const typeSelect = document.getElementById('qr-type');
    const inputGroup = document.getElementById('qr-input-group');
    const hintDiv = document.getElementById('qr-hint');
    const textInput = inputGroup.querySelector('#qr-input');
    const generateBtn = document.getElementById('qr-generate-btn');
    const previewDiv = document.getElementById('qr-preview');
    const errorDiv = document.getElementById('qr-error');
    if (!typeSelect || !inputGroup || !textInput || !generateBtn || !previewDiv || !errorDiv || !hintDiv) return;

    // Type select logic
    function updateInputUI() {
        if (typeSelect.value === 'image' || typeSelect.value === 'video') {
            hintDiv.style.display = '';
            textInput.placeholder = 'Paste image or video URL';
        } else {
            hintDiv.style.display = 'none';
            textInput.placeholder = 'Enter text or URL';
        }
        textInput.value = '';
    }
    typeSelect.addEventListener('change', updateInputUI);
    updateInputUI();

    generateBtn.addEventListener('click', function() {
        previewDiv.innerHTML = '';
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
        const value = textInput.value.trim();
        if (!value) {
            errorDiv.textContent = 'Please enter some text or URL.';
            errorDiv.style.display = 'block';
            return;
        }
        generateQRCode(value, previewDiv, errorDiv);
    });
}

function generateQRCode(data, previewDiv, errorDiv) {
    try {
        previewDiv.innerHTML = '';
        errorDiv.textContent = '';
        const qr = new QRious({
            value: data,
            size: 300,
            level: 'M'
        });
        const img = document.createElement('img');
        img.src = qr.toDataURL();
        img.alt = 'QR Code';
        img.style.maxWidth = '300px';
        img.style.display = 'block';
        img.style.margin = '0 auto 1em auto';
        previewDiv.appendChild(img);
        // Download button
        const downloadBtn = document.createElement('a');
        downloadBtn.href = img.src;
        downloadBtn.download = 'qr-code.png';
        downloadBtn.className = 'btn btn-secondary';
        downloadBtn.textContent = 'Download QR Code';
        previewDiv.appendChild(downloadBtn);
    } catch (e) {
        errorDiv.textContent = 'Failed to generate QR code.';
    }
}

// Utility Functions
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// Download Functions (simulated)
function downloadConvertedImage() {
    alert('Download functionality would be implemented here.');
}

function downloadResizedImage() {
    alert('Download functionality would be implemented here.');
}

function downloadCompressedImage() {
    alert('Download functionality would be implemented here.');
}

function downloadCroppedImage() {
    alert('Download functionality would be implemented here.');
}

function downloadQRCode() {
    alert('Download functionality would be implemented here.');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Quality slider update
    const qualitySlider = document.getElementById('compression-quality');
    const qualityValue = document.getElementById('quality-value');
    if (qualitySlider && qualityValue) {
        qualitySlider.addEventListener('input', function() {
            qualityValue.textContent = this.value;
        });
        // Set initial value
        qualityValue.textContent = qualitySlider.value;
    }

    // Convert button
    const convertBtn = document.getElementById('convert-image-btn');
    if (convertBtn) {
        convertBtn.addEventListener('click', convertImage);
    }

    // File input change handlers
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0]?.name || 'No file selected';
            console.log('File selected:', fileName);
        });
    });

    // Ensure Image Converter is default selected
    // Remove 'active' from all tab buttons and tab contents
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    // Add 'active' to Image Converter tab and content
    const converterBtn = document.querySelector('.tab-btn[data-tab="converter"]');
    const converterTab = document.getElementById('converter');
    if (converterBtn && converterTab) {
        converterBtn.classList.add('active');
        converterTab.classList.add('active');
    }

    // Drag-and-drop and browse for image converter
    setupImageConverterUI();
    setupTransparencyOption();
    setupImageResizerUI();
    setupImageCompressorUI();
    setupImageCropperUI();
    setupImageCropperVisual();
    setupQRCodeUI();
    setupQRScannerUI();
});

function setupImageResizerUI() {
    const dropArea = document.getElementById('resize-drop-area');
    const fileInput = document.getElementById('resize-file');
    const selectBtn = document.getElementById('select-resize-image-btn');
    const fileNameDiv = document.getElementById('resize-selected-file-name');

    if (!dropArea || !fileInput || !selectBtn) return;

    // Button click triggers file input
    selectBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag events
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });
    dropArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
    });
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            fileInput.files = files;
            window.selectedResizeImageFile = files[0];
            if (fileNameDiv) {
                fileNameDiv.textContent = files[0].name;
                fileNameDiv.style.display = '';
            }
        }
    });
    // File input change
    fileInput.addEventListener('change', function() {
        if (fileInput.files && fileInput.files[0]) {
            window.selectedResizeImageFile = fileInput.files[0];
            if (fileNameDiv) {
                fileNameDiv.textContent = fileInput.files[0].name;
                fileNameDiv.style.display = '';
            }
        }
    });
}

function setupImageCompressorUI() {
    const dropArea = document.getElementById('compress-drop-area');
    const fileInput = document.getElementById('compress-file');
    const selectBtn = document.getElementById('select-compress-image-btn');
    const fileNameDiv = document.getElementById('compress-selected-file-name');
    if (!dropArea || !fileInput || !selectBtn) return;
    selectBtn.addEventListener('click', () => { fileInput.click(); });
    dropArea.addEventListener('dragover', (e) => { e.preventDefault(); dropArea.classList.add('dragover'); });
    dropArea.addEventListener('dragleave', (e) => { e.preventDefault(); dropArea.classList.remove('dragover'); });
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault(); dropArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            fileInput.files = files;
            window.selectedCompressImageFile = files[0];
            if (fileNameDiv) { fileNameDiv.textContent = files[0].name; fileNameDiv.style.display = ''; }
        }
    });
    fileInput.addEventListener('change', function() {
        if (fileInput.files && fileInput.files[0]) {
            window.selectedCompressImageFile = fileInput.files[0];
            if (fileNameDiv) { fileNameDiv.textContent = fileInput.files[0].name; fileNameDiv.style.display = ''; }
        }
    });
}

function setupImageCropperUI() {
    const dropArea = document.getElementById('crop-drop-area');
    const fileInput = document.getElementById('crop-file');
    const selectBtn = document.getElementById('select-crop-image-btn');
    const fileNameDiv = document.getElementById('crop-selected-file-name');
    if (!dropArea || !fileInput || !selectBtn) return;
    // Only update file name display, do not add file input or selectBtn event listeners here
    fileInput.addEventListener('change', function() {
        if (fileInput.files && fileInput.files[0]) {
            if (fileNameDiv) { fileNameDiv.textContent = fileInput.files[0].name; fileNameDiv.style.display = ''; }
        }
    });
    dropArea.addEventListener('drop', function(e) {
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (fileNameDiv) { fileNameDiv.textContent = e.dataTransfer.files[0].name; fileNameDiv.style.display = ''; }
        }
    });
}

function setupImageCropperVisual() {
    const fileInput = document.getElementById('crop-file');
    const cropperArea = document.getElementById('cropper-visual-area');
    const canvas = document.getElementById('cropper-canvas');
    const cropRect = document.getElementById('crop-rect');
    const previewCanvas = document.getElementById('cropped-preview');
    const cropBtn = document.getElementById('crop-image-btn');
    const resultDiv = document.getElementById('crop-result');
    let img = null, imgDataUrl = null;
    let crop = { x: 40, y: 40, w: 120, h: 120 };
    let dragging = false, resizing = false, dragOffset = {x:0, y:0}, resizeDir = '';
    let scale = 1;

    function resetCropper() {
        cropperArea.style.display = 'none';
        canvas.width = canvas.height = 1;
        cropRect.style.display = 'none';
        previewCanvas.width = previewCanvas.height = 1;
        resultDiv.innerHTML = '';
    }

    function drawImageAndRect() {
        if (!img) return;
        // Fit image to canvas
        let maxW = 350, maxH = 350;
        let ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        scale = ratio;
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Draw crop rect overlay
        cropRect.style.display = 'block';
        cropRect.style.left = crop.x + 'px';
        cropRect.style.top = crop.y + 'px';
        cropRect.style.width = crop.w + 'px';
        cropRect.style.height = crop.h + 'px';
        cropRect.style.pointerEvents = 'auto';
        cropRect.style.zIndex = 2;
        cropRect.parentNode.style.position = 'relative';
        // Draw preview
        updatePreview();
    }

    function updatePreview() {
        if (!img) return;
        let sx = Math.round(crop.x / scale), sy = Math.round(crop.y / scale), sw = Math.round(crop.w / scale), sh = Math.round(crop.h / scale);
        previewCanvas.width = sw;
        previewCanvas.height = sh;
        const ctx = previewCanvas.getContext('2d');
        ctx.clearRect(0,0,sw,sh);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    }

    function onFileChange(file) {
        if (!file) { resetCropper(); return; }
        const reader = new FileReader();
        reader.onload = function(e) {
            img = new window.Image();
            img.onload = function() {
                cropperArea.style.display = '';
                // Fit image to canvas
                let maxW = 350, maxH = 350;
                let ratio = Math.min(maxW / img.width, maxH / img.height, 1);
                scale = ratio;
                canvas.width = Math.round(img.width * ratio);
                canvas.height = Math.round(img.height * ratio);
                // Default crop area: center square, clamped to canvas
                let minDim = Math.min(canvas.width, canvas.height);
                let cropSize = Math.round(minDim * 0.6);
                let cropX = Math.max(0, Math.round((canvas.width - cropSize) / 2));
                let cropY = Math.max(0, Math.round((canvas.height - cropSize) / 2));
                crop = {
                    x: cropX,
                    y: cropY,
                    w: Math.min(cropSize, canvas.width - cropX),
                    h: Math.min(cropSize, canvas.height - cropY)
                };
                imgDataUrl = e.target.result;
                drawImageAndRect();
            };
            img.onerror = function() { resetCropper(); };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Drag/resize logic
    cropRect.addEventListener('mousedown', function(e) {
        e.preventDefault();
        const rect = cropRect.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        // Near edges for resizing
        const edge = 8;
        if (mx < edge && my < edge) resizeDir = 'nw';
        else if (mx > rect.width - edge && my < edge) resizeDir = 'ne';
        else if (mx < edge && my > rect.height - edge) resizeDir = 'sw';
        else if (mx > rect.width - edge && my > rect.height - edge) resizeDir = 'se';
        else if (mx < edge) resizeDir = 'w';
        else if (mx > rect.width - edge) resizeDir = 'e';
        else if (my < edge) resizeDir = 'n';
        else if (my > rect.height - edge) resizeDir = 's';
        else resizeDir = '';
        if (resizeDir) {
            resizing = true;
            dragOffset.x = mx;
            dragOffset.y = my;
        } else {
            dragging = true;
            dragOffset.x = e.clientX - crop.x - cropRect.parentNode.getBoundingClientRect().left;
            dragOffset.y = e.clientY - crop.y - cropRect.parentNode.getBoundingClientRect().top;
        }
        document.body.style.userSelect = 'none';
    });
    window.addEventListener('mousemove', function(e) {
        if (!dragging && !resizing) return;
        const parentRect = cropRect.parentNode.getBoundingClientRect();
        let mx = e.clientX - parentRect.left, my = e.clientY - parentRect.top;
        if (dragging) {
            // Move crop rect
            let nx = mx - dragOffset.x, ny = my - dragOffset.y;
            nx = Math.max(0, Math.min(nx, canvas.width - crop.w));
            ny = Math.max(0, Math.min(ny, canvas.height - crop.h));
            crop.x = nx; crop.y = ny;
        } else if (resizing) {
            let minSize = 20;
            let ox = crop.x, oy = crop.y, ow = crop.w, oh = crop.h;
            switch (resizeDir) {
                case 'nw':
                    crop.w += crop.x - mx; crop.h += crop.y - my; crop.x = mx; crop.y = my; break;
                case 'ne':
                    crop.w = mx - crop.x; crop.h += crop.y - my; crop.y = my; break;
                case 'sw':
                    crop.w += crop.x - mx; crop.x = mx; crop.h = my - crop.y; break;
                case 'se':
                    crop.w = mx - crop.x; crop.h = my - crop.y; break;
                case 'n':
                    crop.h += crop.y - my; crop.y = my; break;
                case 's':
                    crop.h = my - crop.y; break;
                case 'w':
                    crop.w += crop.x - mx; crop.x = mx; break;
                case 'e':
                    crop.w = mx - crop.x; break;
            }
            // Clamp
            crop.x = Math.max(0, Math.min(crop.x, canvas.width - minSize));
            crop.y = Math.max(0, Math.min(crop.y, canvas.height - minSize));
            crop.w = Math.max(minSize, Math.min(crop.w, canvas.width - crop.x));
            crop.h = Math.max(minSize, Math.min(crop.h, canvas.height - crop.y));
        }
        drawImageAndRect();
    });
    window.addEventListener('mouseup', function() {
        dragging = false; resizing = false; resizeDir = '';
        document.body.style.userSelect = '';
    });

    // File input/drag-and-drop integration
    function handleFile(file) {
        if (file) {
            onFileChange(file);
        } else {
            resetCropper();
        }
    }
    fileInput.addEventListener('change', function() {
        if (fileInput.files && fileInput.files[0]) {
            window.selectedCropImageFile = fileInput.files[0];
            handleFile(fileInput.files[0]);
        }
    });
    // Drag-and-drop
    const dropArea = document.getElementById('crop-drop-area');
    dropArea.addEventListener('drop', function(e) {
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            window.selectedCropImageFile = e.dataTransfer.files[0];
            handleFile(e.dataTransfer.files[0]);
        }
    });
    // Select button
    const selectBtn = document.getElementById('select-crop-image-btn');
    selectBtn.addEventListener('click', () => { fileInput.click(); });

    // Crop button
    cropBtn.addEventListener('click', function() {
        if (!img) return;
        let sx = Math.round(crop.x / scale), sy = Math.round(crop.y / scale), sw = Math.round(crop.w / scale), sh = Math.round(crop.h / scale);
        // Clamp to image bounds
        sx = Math.max(0, Math.min(sx, img.width - 1));
        sy = Math.max(0, Math.min(sy, img.height - 1));
        sw = Math.max(1, Math.min(sw, img.width - sx));
        sh = Math.max(1, Math.min(sh, img.height - sy));
        // Create cropped image
        const outCanvas = document.createElement('canvas');
        outCanvas.width = sw;
        outCanvas.height = sh;
        outCanvas.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        let fileType = (window.selectedCropImageFile && window.selectedCropImageFile.type) || 'image/png';
        let ext = fileType.split('/')[1] || 'png';
        if (ext === 'jpeg') ext = 'jpg';
        let dataUrl = outCanvas.toDataURL(fileType, 0.92);
        let downloadName = (window.selectedCropImageFile ? window.selectedCropImageFile.name.replace(/\.[^.]+$/, '') : 'cropped') + `-cropped.${ext}`;
        let preview = `<img src="${dataUrl}" alt="Cropped Preview" style="max-width:220px;max-height:180px;display:block;margin:0 auto 1.2em auto;border-radius:0.5em;box-shadow:0 2px 8px #0001;">`;
        let downloadBtn = `<a href="${dataUrl}" download="${downloadName}" class="btn btn-primary" style="display:block;margin:0 auto 1em auto;max-width:220px;">Download Cropped Image</a>`;
        let info = `<div style="margin-top:0.5em;font-size:0.95em;color:#888;text-align:center;">Cropped Area: ${sw} x ${sh}<br>File: ${downloadName}</div>`;
        resultDiv.innerHTML = preview + downloadBtn + info;
    });
}

// QR Code Scanner Functions
function setupQRScannerUI() {
    const startCameraBtn = document.getElementById('start-qr-camera-btn');
    const fileInput = document.getElementById('qr-scan-file');
    const fileBtn = document.getElementById('qr-scan-file-btn');
    const fileNameSpan = document.getElementById('qr-scan-file-name');
    const cameraPreview = document.getElementById('qr-camera-preview');
    const resultDiv = document.getElementById('qr-scan-result');
    let videoStream = null;
    let scanning = false;
    if (!startCameraBtn || !fileInput || !fileBtn || !fileNameSpan || !cameraPreview || !resultDiv) return;

    // Custom file button logic
    fileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        fileInput.click();
    });
    fileInput.addEventListener('change', function() {
        if (fileInput.files && fileInput.files[0]) {
            fileNameSpan.textContent = fileInput.files[0].name;
        } else {
            fileNameSpan.textContent = '';
        }
    });
    // Camera scan
    startCameraBtn.addEventListener('click', async function() {
        resultDiv.textContent = '';
        cameraPreview.innerHTML = '';
        cameraPreview.style.display = 'block';
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
        const video = document.createElement('video');
        video.setAttribute('autoplay', '');
        video.setAttribute('playsinline', '');
        video.style.maxWidth = '320px';
        video.style.borderRadius = '0.5em';
        cameraPreview.appendChild(video);
        try {
            videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            video.srcObject = videoStream;
            scanning = true;
            scanVideoFrame();
        } catch (err) {
            resultDiv.textContent = 'Camera access denied or not available.';
            cameraPreview.style.display = 'none';
        }
        function scanVideoFrame() {
            if (!scanning) return;
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                if (window.jsQR) {
                    const code = window.jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        let data = code.data;
                        let html = `<b>QR Code Detected:</b><br>`;
                        if (isValidURL(data)) {
                            html += `<a href="${escapeHTML(data)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-color);text-decoration:underline;word-break:break-all;">${escapeHTML(data)}</a>`;
                        } else {
                            html += escapeHTML(data);
                        }
                        resultDiv.innerHTML = html;
                        scanning = false;
                        videoStream.getTracks().forEach(track => track.stop());
                        videoStream = null;
                        cameraPreview.style.display = 'none';
                        return;
                    }
                }
            }
            if (scanning) requestAnimationFrame(scanVideoFrame);
        }
    });
    // File scan
    fileInput.addEventListener('change', function() {
        resultDiv.textContent = '';
        cameraPreview.style.display = 'none';
        if (!fileInput.files || !fileInput.files[0]) return;
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new window.Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                if (window.jsQR) {
                    const code = window.jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        let data = code.data;
                        let html = `<b>QR Code Detected:</b><br>`;
                        if (isValidURL(data)) {
                            html += `<a href="${escapeHTML(data)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-color);text-decoration:underline;word-break:break-all;">${escapeHTML(data)}</a>`;
                        } else {
                            html += escapeHTML(data);
                        }
                        resultDiv.innerHTML = html;
                    } else {
                        resultDiv.textContent = 'No QR code found in image.';
                    }
                } else {
                    resultDiv.textContent = 'QR scanning library not loaded.';
                }
            };
            img.onerror = function() { resultDiv.textContent = 'Invalid image file.'; };
            img.src = e.target.result;
        };
        reader.onerror = function() { resultDiv.textContent = 'Failed to read image file.'; };
        reader.readAsDataURL(file);
    });
}

function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch (e) {
        return false;
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, function(tag) {
        const charsToReplace = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        };
        return charsToReplace[tag] || tag;
    });
} 