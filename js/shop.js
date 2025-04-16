let products;

let cart = [];
let chart = new Chart("myChart", {
    type: "pie",
    data: {
        labels: [],
        datasets: [{
            backgroundColor: [],
            data: [],
        }]
    },
    options: {}
  }); 
  
  
async function getProducts() {
    const url = "https://chnu-student-interview-preparation.netlify.app/.netlify/functions/listItems?take=100&category=host_shop";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        products = json;
        renderProducts(products[0]["products"]);
        updateCartCount();
    } catch (error) {
        console.error(error.message);
    }
}

async function renderProducts(products) {
    let data = products;
    const shopGrid = document.getElementById('shopGrid');
    shopGrid.innerHTML = "";

    data.forEach(product => {
        let badge = '';
        if(product.badge){
            badge = `<div class="product-badge">${product.badge}</div>`
        }
        
        let card = `
            <div class="product-card">
                ${badge}
                <h3>${product.name}</h3>
                <div class="price">$${product.price}<span>/month</span></div>
                <ul class="features"><li>${product.features.join('</li><li>')}</li></ul>
                <button class="buy-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        `;
        shopGrid.innerHTML += card;
    });
}


function sortProducts() {
    const sortType = document.getElementById('sortSelect').value;
    let sortedProducts = [...products[0]["products"]];

    switch (sortType) {
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
    }

    filterProducts(sortedProducts);
}

function filterProducts(sortedProducts = products[0]["products"]) {
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

    const filteredProducts = sortedProducts.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );

    renderProducts(filteredProducts);
}

function addToCart(plan) {
    const product = products[0]["products"].find(p => p.id === plan);
    const existingItem = cart.find(item => item.id === plan);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    updateChart(cart);
    updateCartCount();
    console.log(cart);
    renderCart();
    
    
      
}

function updateChart(cart) {
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    cart.forEach((item) => {
        chart.data.labels.push(item.name);
        chart.data.datasets[0].data.push(item.quantity);
        chart.data.datasets[0].backgroundColor.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
    });

    chart.update()

}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
    }
    renderCart();
    updateCartCount();
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h3>${item.name}</h3>
                <p>$${item.price}/month</p>
            </div>
            <div class="cart-quantity">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
        </div>
    `).join('');

    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);
    
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Proceeding to checkout...');
}

function clearCart() {
    cart = [];
    renderCart();
    updateCartCount();
    window.location.hash = '#cartModal';
}

document.addEventListener('DOMContentLoaded', () => {
    getProducts();
});