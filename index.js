
let cart = JSON.parse(localStorage.getItem('cart')) || [];


function addToCart(productId, name, price, image) {

    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId,
            name,
            price,
            image,
            quantity: 1
        });
    }
    
 
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}


function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return; 
    
    cartItemsContainer.innerHTML = ''; 
    
    cart.forEach(item => {
        const cartItemHTML = `
            <div class="cart-item" data-id="${item.productId}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-category">Single Perfume</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="updateQuantity('${item.productId}', -1)">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" onchange="updateQuantityInput('${item.productId}', this.value)">
                        <button class="quantity-btn plus" onclick="updateQuantity('${item.productId}', 1)">+</button>
                    </div>
                </div>
                <div class="item-price">
                    <p class="price">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-item" onclick="removeItem('${item.productId}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });
    
    updateOrderSummary();
}


function updateQuantity(productId, change) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }
}


function updateQuantityInput(productId, newValue) {
    const quantity = parseInt(newValue);
    if (quantity > 0) {
        const item = cart.find(item => item.productId === productId);
        if (item) {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }
}


function removeItem(productId) {
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}


function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 10 : 0;
    const tax = subtotal * 0.08; // 
    const total = subtotal + shipping + tax;

    const summary = document.querySelector('.summary-details');
    if (summary) {
        summary.innerHTML = `
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productBox = button.closest('.product-box');
            const productId = productBox.dataset.id || Math.random().toString(36).substr(2, 9);
            const name = productBox.querySelector('h3').textContent;
            const price = parseFloat(productBox.querySelector('.price').textContent.replace('$', ''));
            const image = productBox.querySelector('img').src;
            
            addToCart(productId, name, price, image);
        });
    });
});