// Default initial data for preview
const defaultProducts = [
    {
        id: 1,
        name: "Premium Headphones",
        category: "Electronics",
        price: "15000",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80"
        ],
        description: "High quality wireless headphones with noise cancellation."
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: "8500",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80"
        ],
        description: "Fitness tracker with heart rate monitor."
    },
    {
        id: 3,
        name: "Leather Wallet",
        category: "Accessories",
        price: "3200",
        images: [
            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
            "https://images.unsplash.com/photo-1559564299-8d5462fcbc28?w=500&q=80"
        ],
        description: "Genuine leather bifold wallet."
    }
];

function getProducts() {
    const productsJson = localStorage.getItem('products');
    if (!productsJson) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        return defaultProducts;
    }

    let products = JSON.parse(productsJson);
    // Migrate old data
    products = products.map(p => {
        if (p.image && !p.images) {
            p.images = [p.image];
            delete p.image;
        }
        return p;
    });

    return products;
}

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

function getWhatsAppNumber() {
    const number = localStorage.getItem('whatsapp_number');
    return number || "94700000000"; // Default Sri Lankan number format
}

function saveWhatsAppNumber(number) {
    localStorage.setItem('whatsapp_number', number);
}
