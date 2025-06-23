// Initialize cart array and total
let cart = [];
let total = 0;

//Get DOM elements
const cartIcon = document.querySelector('.fa-bag-shopping');
const cartCount = document.querySelector('.fa-bag-shopping + span');

//Create shopping cart modal
const cartModal = document.createElement('div');
cartModal.innerHTML = `
    <div class="cart-modal" style="position: fixed; top: 80px; right: 20px; width: 350px; max-height: 80vh; overflow-y: auto; background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: none; z-index: 1000;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0;">Shopping Cart</h3>
            <button class="btn btn-outline-danger btn-sm" onclick="clearCart()">Clear Cart</button>
        </div>
        <div id="cart-items"></div>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
            <h4>Total: USD <span id="cart-total">0.00</span></h4>
            <button class="btn btn-success w-100" onclick="checkout()">Checkout</button>
        </div>
    </div>
`;
document.body.appendChild(cartModal);

// Show/hide cart when clicking cart icon
cartIcon.style.cursor = 'pointer';
cartIcon.addEventListener('click', () => {
    const cartModal = document.querySelector('.cart-modal');
    cartModal.style.display = cartModal.style.display === 'none' ? 'block' : 'none';
});

// Get search elements
const searchInput = document.getElementById('search');
const searchButton = document.querySelector('.btn-outline-danger');
const productCards = document.querySelectorAll('.card');

// Search function
function searchProducts() {
   const searchTerm = searchInput.value.toLowerCase().trim();
   
   productCards.forEach(card => {
       const productName = card.querySelector('.display-5').textContent.toLowerCase();
       const productContainer = card.closest('.col-xl-3');
       
       if (productName.includes(searchTerm)) {
           productContainer.style.display = 'block';
       } else {
           productContainer.style.display = 'none';
       }
   });
}

// Add event listeners for search
searchButton.addEventListener('click', searchProducts);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
});


// Add to cart functionality
document.querySelectorAll('.card').forEach(card => {
   const button = card.querySelector('.btn');
   const priceText = card.querySelector('p:nth-last-child(2)').textContent;
   const price = parseFloat(priceText.replace('USD ', ''));
   const imageUrl = card.querySelector('img').src;
   
   button.addEventListener('click', () => {
       const name = card.querySelector('.display-5').textContent;
       const brand = card.closest('.row').previousElementSibling.textContent;
       addToCart(brand, name, price, imageUrl);
       showNotification('Added to cart!');
   });
});

function addToCart(brand, name, price, imageUrl) {
   cart.push({ brand, name, price, imageUrl });
   total += price;
   updateCartDisplay();
   updateCartCount();
}

function updateCartDisplay() {
   const cartItems = document.getElementById('cart-items');
   const cartTotal = document.getElementById('cart-total');
   
   cartItems.innerHTML = cart.map((item, index) => `
       <div style="display: flex; gap: 10px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
           <div style="width: 60px; height: 60px; flex-shrink: 0;">
               <img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
           </div>
           <div style="flex-grow: 1;">
               <div style="font-weight: bold;">${item.brand}</div>
               <div>${item.name}</div>
               <div style="color: #2c5282;">USD ${item.price.toFixed(2)}</div>
           </div>
           <button class="btn btn-outline-danger btn-sm" style="height: fit-content;" onclick="removeItem(${index})">×</button>
       </div>
   `).join('');
   
   cartTotal.textContent = total.toFixed(2);
}

function updateCartCount() {
   cartCount.textContent = cart.length;
}

function removeItem(index) {
   total -= cart[index].price;
   cart.splice(index, 1);
   updateCartDisplay();
   updateCartCount();
   showNotification('Item removed from cart!');
}

function clearCart() {
   cart = [];
   total = 0;
   updateCartDisplay();
   updateCartCount();
   showNotification('Cart cleared!');
}

function checkout() {
   if (cart.length === 0) {
       alert('Your cart is empty!');
       return;
   }
   
   let orderSummary = 'Order Summary:\n\n';
   cart.forEach(item => {
       orderSummary += `${item.brand} - ${item.name}\nUSD ${item.price.toFixed(2)}\n\n`;
   });
   orderSummary += `\nTotal: USD ${total.toFixed(2)}`;
   
   alert(orderSummary + '\n\nThank you for your purchase!');
   clearCart();
   document.querySelector('.cart-modal').style.display = 'none';
}

function showNotification(message) {
   const notification = document.createElement('div');
   notification.style.cssText = `
       position: fixed;
       top: 20px;
       right: 20px;
       background-color: #4CAF50;
       color: white;
       padding: 15px 25px;
       border-radius: 5px;
       z-index: 1002;
       opacity: 0;
       transition: opacity 0.3s;
   `;
   notification.textContent = message;
   document.body.appendChild(notification);
   
   // Trigger animation
   setTimeout(() => notification.style.opacity = '1', 10);
   setTimeout(() => {
       notification.style.opacity = '0';
       setTimeout(() => notification.remove(), 300);
   }, 2000);
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
   const cartModal = document.querySelector('.cart-modal');
   if (cartModal && !cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
       cartModal.style.display = 'none';
   }
});



