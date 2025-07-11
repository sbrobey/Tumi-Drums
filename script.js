document.addEventListener("DOMContentLoaded", function() {
    const products = [
        {
            name: "Djembe",
            description: "Deep bass, rich tone, hand-carved from hardwood and goatskin. Ideal for soloists and traditional ensembles.",
            price: "$150",
            image: "4AjhbCHwPUI3.jpg"
        },
        {
            name: "Kpanlogo",
            description: "A lively, social drum perfect for dance rhythms and ceremonies.",
            price: "$130",
            image: "BnDwdSTQ7UEC.jpg"
        },
        {
            name: "Atumpan (Talking Drum)",
            description: "Culturally revered \"talking drum\" used for storytelling and royal communication.",
            price: "$170",
            image: "v7xgFTnz9czH.jpg"
        },
        {
            name: "Ewe Drum Set (Sogo, Kidi, Kagan)",
            description: "Traditional Ewe ensemble drums used for layered polyrhythms and group drumming.",
            price: "$300",
            image: "TJ8UHO7T0XUX.jpg"
        },
        {
            name: "Gome Drum",
            description: "Large, box-style drum played with hands and feet. Deep and resonant.",
            price: "$160",
            image: "fVC3IOevzI3x.jpg"
        },
        {
            name: "Custom Engraved Drums",
            description: "Choose your logo, symbol, or name. Perfect for schools, institutions, or gifting.",
            price: "$180",
            image: "GYhoyO94GXfr.jpg"
        }
    ];

    const productGrid = document.querySelector(".product-grid");

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${product.price}</p>
                <div class="product-buttons">
                    <button class="btn sound-btn" onclick="playDrumSound('${product.name.toLowerCase().replace(/[^a-z0-9]/g, '')}')">🔊 Play Sound</button>
                    <button class="btn primary add-to-cart-btn" onclick="addToCart({name: '${product.name}', price: '${product.price}', image: '${product.image}'})">Add to Cart</button>
                    <a href="#contact" class="btn secondary">Contact Us</a>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Initialize mobile navigation
    initializeMobileNavigation();
    
    // Initialize cart functionality
    initializeCartFunctionality();
});

// Mobile Navigation Functionality
function initializeMobileNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", function() {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", function() {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }
}

// Shopping Cart Functionality
let cart = [];

function addToCart(product) {
    // Handle both object and individual parameters for backward compatibility
    let name, price, image;
    
    if (typeof product === 'object') {
        name = product.name;
        price = product.price;
        image = product.image;
    } else {
        // For backward compatibility with old function calls
        name = arguments[0];
        price = arguments[1];
        image = arguments[2];
    }
    
    // Parse price (remove $ and convert to number)
    const numericPrice = parseFloat(price.replace('$', '').replace('+', ''));
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: numericPrice,
            image: image,
            quantity: 1
        });
    }
    
    updateCartUI();
    showCartNotification(name);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
}

function updateQuantity(name, quantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = Math.max(1, quantity);
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                <p>$${itemTotal.toFixed(2)}</p>
                <button class="remove-item" onclick="removeFromCart('${item.name}')">&times;</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.textContent = total.toFixed(2);
    
    // Show empty cart message if no items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

function showCartNotification(itemName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${itemName} added to cart!`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--forest-green);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Initialize cart functionality for additional drums
function initializeCartFunctionality() {
    const additionalCartButtons = document.querySelectorAll('.add-to-cart-additional');
    
    additionalCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.closest('.drum-item').querySelector('.drum-thumb').src;
            
            addToCart({
                name: name,
                price: '$' + price,
                image: image
            });
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 1500);
        });
    });

    // Cart link functionality
    const cartLink = document.querySelector('.cart-link');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }
}

// Checkout Functionality
function openCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    // Populate checkout items
    checkoutItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        checkoutItems.appendChild(checkoutItem);
    });
    
    checkoutTotal.textContent = total.toFixed(2);
    modal.style.display = 'block';
    
    // Close cart sidebar
    toggleCart();
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function processPayment() {
    const form = document.getElementById('shipping-form');
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Validate form
    if (!form.checkValidity()) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Get form data
    const orderData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shipping: {
            name: document.getElementById('full-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            country: document.getElementById('country').value,
            address: document.getElementById('address').value
        },
        paymentMethod: paymentMethod
    };
    
    // Process based on payment method
    switch(paymentMethod) {
        case 'card':
            processCardPayment(orderData);
            break;
        case 'bank':
            processBankTransfer(orderData);
            break;
        case 'momo':
            processMobileMoneyPayment(orderData);
            break;
        case 'paypal':
            processPayPalPayment(orderData);
            break;
    }
}

function processCardPayment(orderData) {
    alert('Card payment processing would be handled by a secure payment gateway like Stripe or PayStack.');
    completeOrder(orderData);
}

function processBankTransfer(orderData) {
    alert('Bank transfer details have been provided. Please complete the transfer and send proof of payment to our WhatsApp.');
    completeOrder(orderData);
}

function processMobileMoneyPayment(orderData) {
    const provider = document.getElementById('momo-provider').value;
    const number = document.getElementById('momo-number').value;
    
    if (!provider || !number) {
        alert('Please select a mobile money provider and enter your number.');
        return;
    }
    
    alert(`Mobile Money payment request sent to ${number} via ${provider}. Please complete the payment on your phone.`);
    completeOrder(orderData);
}

function processPayPalPayment(orderData) {
    alert('You would be redirected to PayPal to complete your payment.');
    completeOrder(orderData);
}

function completeOrder(orderData) {
    // Generate order summary for WhatsApp
    const whatsappMessage = generateWhatsAppMessage(orderData);
    const whatsappUrl = `https://wa.me/233544311096?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Clear cart
    cart = [];
    updateCartUI();
    
    // Close checkout modal
    closeCheckout();
    
    // Show success message and redirect to WhatsApp
    alert('Order placed successfully! You will be redirected to WhatsApp to confirm your order.');
    window.open(whatsappUrl, '_blank');
}

function generateWhatsAppMessage(orderData) {
    let message = "🥁 *New Order from Tumi Drums Website*\\n\\n";
    message += "*Order Details:*\\n";
    
    orderData.items.forEach(item => {
        message += `• ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\\n`;
    });
    
    message += `\\n*Total: $${orderData.total.toFixed(2)}*\\n\\n`;
    
    message += "*Shipping Information:*\\n";
    message += `Name: ${orderData.shipping.name}\\n`;
    message += `Email: ${orderData.shipping.email}\\n`;
    message += `Phone: ${orderData.shipping.phone}\\n`;
    message += `Country: ${orderData.shipping.country}\\n`;
    message += `Address: ${orderData.shipping.address}\\n\\n`;
    
    message += `*Payment Method:* ${orderData.paymentMethod.toUpperCase()}\\n\\n`;
    message += "Please confirm this order and provide payment instructions.";
    
    return message;
}

// Payment method switching
document.addEventListener('DOMContentLoaded', function() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all payment forms
            document.querySelectorAll('.payment-form').forEach(form => {
                form.style.display = 'none';
            });
            
            // Show selected payment form
            const selectedForm = document.getElementById(this.value + '-details');
            if (selectedForm) {
                selectedForm.style.display = 'block';
            }
        });
    });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Drum Sound Functionality
function playDrumSound(drumType) {
    // Create audio element and play the corresponding drum sound
    const audio = new Audio();
    
    // Map drum types to sound files
    const soundMap = {
        'djembe': 'sounds/djembe.mp3',
        'kpanlogo': 'sounds/kpanlogo.mp3',
        'atumpantalkingdrum': 'sounds/atumpan.mp3',
        'ewedrumsetsogokarikagan': 'sounds/ewe_set.mp3',
        'gomedrum': 'sounds/gome.mp3',
        'customengraveddrums': 'sounds/djembe.mp3'
    };
    
    audio.src = soundMap[drumType] || soundMap['djembe'];
    
    // Handle audio loading and playing
    audio.addEventListener('canplaythrough', function() {
        audio.play().catch(error => {
            console.log('Audio play failed:', error);
            showAudioMessage(drumType);
        });
    });
    
    audio.addEventListener('error', function() {
        console.log('Audio loading failed');
        showAudioMessage(drumType);
    });
    
    // Load the audio
    audio.load();
}

function showAudioMessage(drumType) {
    // Create a temporary message when audio is not available
    const message = document.createElement('div');
    message.className = 'audio-message';
    message.textContent = `🥁 ${drumType.charAt(0).toUpperCase() + drumType.slice(1)} sound would play here!`;
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--vibrant-orange);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(message);
    
    // Remove message after 2 seconds
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 2000);
}

