document.addEventListener('DOMContentLoaded', () => {
    // Check login state
    const isLoggedIn = sessionStorage.getItem('admin_logged') === 'true';

    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginForm = document.getElementById('loginForm');
    const loginAlert = document.getElementById('loginAlert');

    // Switch views
    if (isLoggedIn) {
        showDashboard();
    } else {
        loginSection.classList.remove('hidden');
    }

    // Login Logic
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        if (user === "USER 2003" && pass === "Abc@1234") {
            sessionStorage.setItem('admin_logged', 'true');
            showDashboard();
        } else {
            loginAlert.classList.remove('hidden');
        }
    });

    // Logout Logic
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('admin_logged');
        window.location.reload();
    });

    function showDashboard() {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        initDashboard();
    }

    function initDashboard() {
        let products = getProducts();

        // Settings form
        const settingsForm = document.getElementById('settingsForm');
        document.getElementById('whatsappNumber').value = getWhatsAppNumber();

        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const num = document.getElementById('whatsappNumber').value;
            saveWhatsAppNumber(num);
            alert('Settings saved successfully!');
        });

        // Image Upload Logic
        let uploadedImages = [];
        const imageUploadArea = document.getElementById('imageUploadArea');
        const productImageFile = document.getElementById('productImageFile');
        const productImageUrl = document.getElementById('productImage');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');

        function renderImagePreviews() {
            imagePreviewContainer.innerHTML = '';
            uploadedImages.forEach((src, index) => {
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';

                const img = document.createElement('img');
                img.src = src;
                img.style.width = '60px';
                img.style.height = '60px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '4px';
                img.style.border = '1px solid rgba(255,255,255,0.1)';

                const removeBtn = document.createElement('div');
                removeBtn.innerHTML = '&times;';
                removeBtn.style.position = 'absolute';
                removeBtn.style.top = '-5px';
                removeBtn.style.right = '-5px';
                removeBtn.style.background = 'var(--danger)';
                removeBtn.style.color = 'white';
                removeBtn.style.borderRadius = '50%';
                removeBtn.style.width = '18px';
                removeBtn.style.height = '18px';
                removeBtn.style.display = 'flex';
                removeBtn.style.alignItems = 'center';
                removeBtn.style.justifyContent = 'center';
                removeBtn.style.fontSize = '12px';
                removeBtn.style.cursor = 'pointer';
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    uploadedImages.splice(index, 1);
                    renderImagePreviews();
                };

                wrapper.appendChild(img);
                wrapper.appendChild(removeBtn);
                imagePreviewContainer.appendChild(wrapper);
            });
        }

        imageUploadArea.addEventListener('click', (e) => {
            if (e.target !== productImageUrl && e.target !== imagePreviewContainer && !imagePreviewContainer.contains(e.target)) {
                productImageFile.click();
            }
        });

        imageUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadArea.classList.add('dragover');
        });

        imageUploadArea.addEventListener('dragleave', () => {
            imageUploadArea.classList.remove('dragover');
        });

        imageUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadArea.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                handleFiles(e.dataTransfer.files);
            }
        });

        productImageFile.addEventListener('change', () => {
            if (productImageFile.files.length) {
                handleFiles(productImageFile.files);
            }
        });

        productImageUrl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const url = productImageUrl.value.trim();
                if (url) {
                    uploadedImages.push(url);
                    renderImagePreviews();
                    productImageUrl.value = '';
                }
            }
        });

        function handleFiles(files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        uploadedImages.push(e.target.result);
                        renderImagePreviews();
                    };
                    reader.readAsDataURL(file);
                }
            });
            productImageFile.value = '';
        }

        // Add Product form
        const productForm = document.getElementById('productForm');
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (uploadedImages.length === 0) {
                alert('Please add at least one image!');
                return;
            }

            const newProduct = {
                id: Date.now(),
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                price: document.getElementById('productPrice').value,
                images: [...uploadedImages],
                description: document.getElementById('productDescription').value
            };

            products.push(newProduct);
            saveProducts(products);
            renderTable();
            productForm.reset();
            uploadedImages = [];
            renderImagePreviews();
            productImageUrl.value = '';
            alert('Product added successfully!');
        });

        // Delete Product logic
        window.deleteProduct = function (id) {
            if (confirm('Are you confirm you want to remove this product?')) {
                products = products.filter(p => p.id !== id);
                saveProducts(products);
                renderTable();
            }
        };

        function renderTable() {
            const tbody = document.getElementById('adminProductTable');
            tbody.innerHTML = '';

            if (products.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No products available.</td></tr>';
                return;
            }

            products.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${p.images && p.images.length ? p.images[0] : ''}" alt="${p.name}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;"></td>
                    <td>${p.name}</td>
                    <td>${p.category}</td>
                    <td>LKR ${Number(p.price).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-danger" style="padding:0.4rem 0.8rem; width:auto;" onclick="deleteProduct(${p.id})">Remove</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        renderTable();
    }
});
