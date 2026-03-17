document.addEventListener('DOMContentLoaded', () => {
    const products = getProducts();
    const whatsapp = getWhatsAppNumber();

    const categoryContainer = document.getElementById('categoryContainer');
    const productGrid = document.getElementById('productGrid');

    // Get unique categories
    const categories = ["All", ...new Set(products.map(p => p.category))];
    let currentCategory = "All";

    // Render Categories
    function renderCategories() {
        categoryContainer.innerHTML = '';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `cat-btn ${cat === currentCategory ? 'active' : ''}`;
            btn.textContent = cat;
            btn.addEventListener('click', () => {
                currentCategory = cat;
                renderCategories();
                renderProducts();
            });
            categoryContainer.appendChild(btn);
        });
    }

    // Render Products
    function renderProducts() {
        productGrid.innerHTML = '';

        const filtered = currentCategory === "All"
            ? products
            : products.filter(p => p.category === currentCategory);

        if (filtered.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">No products found in this category.</p>';
            return;
        }

        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            const firstImage = product.images && product.images.length > 0 ? product.images[0] : '';

            card.innerHTML = `
                <img src="${firstImage}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">LKR ${Number(product.price).toLocaleString()}</div>
                    <button class="btn" style="margin-top: auto;">View Details</button>
                </div>
            `;

            card.addEventListener('click', () => openModal(product));
            productGrid.appendChild(card);
        });
    }

    // Modal Logic
    const modal = document.getElementById('productModal');
    const closeModal = document.getElementById('closeModal');

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    function openModal(product) {
        document.getElementById('modalTitle').textContent = product.name;
        document.getElementById('modalCategory').textContent = product.category;
        document.getElementById('modalPrice').textContent = `LKR ${Number(product.price).toLocaleString()}`;
        document.getElementById('modalDescription').textContent = product.description || '';

        const mainImage = document.getElementById('modalMainImage');
        const thumbnailsContainer = document.getElementById('modalThumbnails');

        // Reset and set images
        thumbnailsContainer.innerHTML = '';
        const images = product.images && product.images.length ? product.images : [''];

        mainImage.src = images[0];

        images.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            if (index === 0) thumb.classList.add('active');

            thumb.addEventListener('click', () => {
                mainImage.style.opacity = '0.5';
                setTimeout(() => {
                    mainImage.src = imgSrc;
                    mainImage.style.opacity = '1';
                }, 150);

                document.querySelectorAll('#modalThumbnails img').forEach(i => i.classList.remove('active'));
                thumb.classList.add('active');
            });

            thumbnailsContainer.appendChild(thumb);
        });

        const message = `Hello, I would like to order: ${product.name} - LKR ${product.price}. ID: ${product.id}`;
        document.getElementById('modalWhatsAppBtn').href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

        modal.classList.remove('hidden');
    }

    renderCategories();
    renderProducts();
});
