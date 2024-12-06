document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const controls = document.getElementById('controls');
    const previewContainer = document.getElementById('previewContainer');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualityInput = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    // 处理文件上传
    function handleFileSelect(file) {
        if (!file.type.match('image.*')) {
            alert('请上传图片文件！');
            return;
        }

        // 显示原始文件大小
        originalSize.textContent = formatFileSize(file.size);

        // 显示控制区域和预览区域
        controls.style.display = 'block';
        previewContainer.style.display = 'grid';

        // 预览原图
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            compressImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(src) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const quality = qualityInput.value / 100;
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            
            compressedImage.src = compressedDataUrl;

            // 计算压缩后的大小
            const compressedSizeInBytes = Math.round((compressedDataUrl.length - 22) * 3 / 4);
            compressedSize.textContent = formatFileSize(compressedSizeInBytes);

            // 设置下载链接
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.download = 'compressed-image.jpg';
                link.href = compressedDataUrl;
                link.click();
            };
        };
        img.src = src;
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 事件监听
    uploadArea.onclick = () => fileInput.click();
    
    fileInput.onchange = (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    qualityInput.oninput = (e) => {
        qualityValue.textContent = e.target.value + '%';
        if (originalImage.src) {
            compressImage(originalImage.src);
        }
    };

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#DEDEDE';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });
}); 