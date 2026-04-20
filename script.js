// Simple script for mobile menu toggle and cart functionality
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('nav ul');
    const menuToggle = document.createElement('button');
    menuToggle.textContent = 'Menu';
    menuToggle.style.display = 'none';
    menuToggle.style.background = 'none';
    menuToggle.style.border = 'none';
    menuToggle.style.fontSize = '1.2rem';
    menuToggle.style.color = '#fff';
    menuToggle.style.cursor = 'pointer';

    document.querySelector('header .container').appendChild(menuToggle);

    menuToggle.addEventListener('click', function () {
        nav.classList.toggle('show');
    });

    // Show menu toggle on small screens
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'block';
        } else {
            menuToggle.style.display = 'none';
            nav.classList.remove('show');
        }
    }

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();

    // Cart functionality
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }
    updateCartCount();

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            const productElement = this.closest('.product');
            const productName = productElement.querySelector('h3').textContent;
            const productPrice = productElement.querySelector('.price').textContent;
            const productImage = productElement.querySelector('img').src;

            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };

            const existingProduct = cart.find(item => item.id === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${productName} added to cart!`);
        });
    });

    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Cart icon click to show cart (simple alert for now)
    document.querySelector('.cart-icon').addEventListener('click', function () {
        if (cart.length === 0) {
            alert('Your cart is empty.');
        } else {
            let cartSummary = 'Your Cart:\n';
            cart.forEach(item => {
                cartSummary += `${item.name} - ${item.price} x ${item.quantity}\n`;
            });
            const total = cart.reduce((sum, item) => {
                const numPrice = parseFloat(item.price.replace(/₨|,/g, ''));
                return sum + (numPrice * item.quantity);
            }, 0);
            cartSummary += `Total: ₨${total.toLocaleString()}`;
            alert(cartSummary);
        }
    });

    // Gallery functionality
    const suitDisplay = document.getElementById('suitDisplay');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Config: number of images in the gallery
    const maxImages = 3;
    let currentImageIndex = 1;
    let galleryInterval;

    function updateGallery(index) {
        // Fade out
        suitDisplay.classList.remove('fade-in-active');

        // Wait for fade out, then change source and fade back in
        setTimeout(() => {
            suitDisplay.src = `images/suit${index}.jpg`;
            suitDisplay.classList.add('fade-in-active');
        }, 500); // Wait time matches CSS transition duration
    }

    function nextImage() {
        currentImageIndex = currentImageIndex >= maxImages ? 1 : currentImageIndex + 1;
        updateGallery(currentImageIndex);
        resetGalleryInterval();
    }

    function prevImage() {
        currentImageIndex = currentImageIndex <= 1 ? maxImages : currentImageIndex - 1;
        updateGallery(currentImageIndex);
        resetGalleryInterval();
    }

    function resetGalleryInterval() {
        clearInterval(galleryInterval);
        galleryInterval = setInterval(nextImage, 4000);
    }

    if (suitDisplay && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', nextImage);
        prevBtn.addEventListener('click', prevImage);

        // Start automatic changing
        galleryInterval = setInterval(nextImage, 4000);
    }
});