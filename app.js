// Simple shop app with 7 example products, cart, and auth modals.
// This file handles rendering products, add-to-cart, cart UI, and localStorage.

const PRODUCTS = [
  {
    id: "p1",
    name: "Cotton Tee - White",
    price: 19.99,
    img: "https://images.unsplash.com/photo-1520975915300-4a9b59f2c7b1?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1b3b5f4d5b2f9e0a9c1f34d41c4d1638",
    desc: "Soft breathable cotton tee, classic fit."
  },
  {
    id: "p2",
    name: "Denim Jacket",
    price: 69.00,
    img: "https://images.unsplash.com/photo-1618354692796-5d5f3d2ef09b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=ad9b2b4c6b1a2a3f0b8b1f6a3a2b7c1d",
    desc: "Stylish denim jacket for all seasons."
  },
  {
    id: "p3",
    name: "Chino Pants - Khaki",
    price: 39.5,
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8f8d3c3b2f6a7ce2b2d7f87a51a0b6c9",
    desc: "Comfortable chinos, slim but not tight."
  },
  {
    id: "p4",
    name: "Summer Dress - Floral",
    price: 49.99,
    img: "https://images.unsplash.com/photo-1503342452485-86f7e8a1b3a3?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2f1c9f56a6b2d5e1a4b3e1c8b9d7f6a2",
    desc: "Lightweight dress with floral print."
  },
  {
    id: "p5",
    name: "Hoodie - Charcoal",
    price: 34.0,
    img: "https://images.unsplash.com/photo-1530845640855-4f4f7d3c8b3b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4b8b4d5a9192b4a3c7c6d2b1e9f3c5a0",
    desc: "Cozy hoodie, fleece-lined."
  },
  {
    id: "p6",
    name: "Sneaker - White",
    price: 59.99,
    img: "https://images.unsplash.com/photo-1526178618864-ef13b5e7bd72?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=c9e8e2b6a3d2d9f8c1c6a4e2b3f0d9a4",
    desc: "Classic white sneakers for everyday use."
  },
  {
    id: "p7",
    name: "Beanie - Navy",
    price: 14.75,
    img: "https://images.unsplash.com/photo-1530845640910-7c6e9d3b8d9c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    desc: "Warm knit beanie, one size fits most."
  }
];

const productContainer = document.getElementById("products");
const cartModal = document.getElementById("cart-modal");
const authModal = document.getElementById("auth-modal");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountLeft = document.getElementById("cart-count-left");
const cartCountRight = document.getElementById("cart-count-right");
const cartBtnLeft = document.getElementById("cart-btn-left");
const cartBtnRight = document.getElementById("cart-btn-right");

let cart = loadCart();

// Render product cards
function renderProducts(){
  productContainer.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy" />
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="muted">${p.desc}</p>
        <div class="price-row">
          <div><strong>$${p.price.toFixed(2)}</strong></div>
          <button class="add-btn" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    `;
    productContainer.appendChild(card);
  });

  // Attach event listeners
  productContainer.querySelectorAll(".add-btn").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const id = e.currentTarget.dataset.id;
      addToCart(id, 1);
    });
  });
}

// Cart functions
function loadCart(){
  try{
    const raw = localStorage.getItem("shop_cart_v1");
    return raw ? JSON.parse(raw) : {};
  }catch(e){
    return {};
  }
}
function saveCart(){
  localStorage.setItem("shop_cart_v1", JSON.stringify(cart));
  updateCartCounts();
}
function addToCart(productId, qty=1){
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart();
  showToast("Added to cart");
}
function setQty(productId, qty){
  if(qty <= 0) delete cart[productId];
  else cart[productId] = qty;
  saveCart();
}
function removeFromCart(productId){
  delete cart[productId];
  saveCart();
}
function cartItemsList(){
  return Object.keys(cart).map(id=>{
    const product = PRODUCTS.find(p=>p.id===id);
    return { product, qty: cart[id] };
  });
}
function cartTotal(){
  return cartItemsList().reduce((s,it)=>s + it.product.price * it.qty, 0);
}

// Render cart modal
function openCart(){
  renderCartItems();
  cartModal.setAttribute("aria-hidden", "false");
}
function closeCart(){
  cartModal.setAttribute("aria-hidden", "true");
}
function renderCartItems(){
  const items = cartItemsList();
  cartItemsEl.innerHTML = "";
  if(items.length === 0){
    cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalEl.textContent = "0.00";
    return;
  }
  items.forEach(item=>{
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="${item.product.img}" alt="${item.product.name}" />
      <div class="cart-item-details">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${item.product.name}</strong>
          <button class="remove-btn" data-id="${item.product.id}">Remove</button>
        </div>
        <div style="color:var(--muted);margin-top:6px;">$${item.product.price.toFixed(2)}</div>
        <div style="margin-top:8px;display:flex;align-items:center;gap:8px;">
          <div class="qty-controls">
            <button class="dec" data-id="${item.product.id}">-</button>
            <div style="min-width:32px;text-align:center">${item.qty}</div>
            <button class="inc" data-id="${item.product.id}">+</button>
          </div>
          <div style="margin-left:auto;"><strong>$${(item.product.price * item.qty).toFixed(2)}</strong></div>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(el);
  });

  // attach buttons
  cartItemsEl.querySelectorAll(".inc").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = e.currentTarget.dataset.id;
      setQty(id, (cart[id] || 0) + 1);
      renderCartItems();
    });
  });
  cartItemsEl.querySelectorAll(".dec").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = e.currentTarget.dataset.id;
      setQty(id, (cart[id] || 0) - 1);
      renderCartItems();
    });
  });
  cartItemsEl.querySelectorAll(".remove-btn").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = e.currentTarget.dataset.id;
      removeFromCart(id);
      renderCartItems();
    });
  });

  cartTotalEl.textContent = cartTotal().toFixed(2);
}

// UI helpers
function updateCartCounts(){
  const totalQty = Object.values(cart).reduce((s,v)=>s+v,0);
  cartCountLeft.textContent = totalQty;
  cartCountRight.textContent = totalQty;
}

// tiny toast
function showToast(msg){
  const t = document.createElement("div");
  t.textContent = msg;
  Object.assign(t.style, {
    position:"fixed",
    bottom:"90px",
    left:"50%",
    transform:"translateX(-50%)",
    background:"#111",
    color:"#fff",
    padding:"8px 12px",
    borderRadius:"8px",
    zIndex:200
  });
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity = 0, 1500);
  setTimeout(()=> t.remove(), 2300);
}

// Auth modal (demo only)
const signinBtn = document.getElementById("signin-btn");
const loginBtn = document.getElementById("login-btn");
const closeAuthBtn = document.getElementById("close-auth");
const authTitle = document.getElementById("auth-title");
const authForm = document.getElementById("auth-form");

signinBtn.addEventListener("click", ()=>{
  openAuth("Sign In");
});
loginBtn.addEventListener("click", ()=>{
  openAuth("Login");
});
closeAuthBtn.addEventListener("click", closeAuth);
function openAuth(mode){
  authTitle.textContent = mode;
  authModal.setAttribute("aria-hidden", "false");
}
function closeAuth(){
  authModal.setAttribute("aria-hidden", "true");
}
authForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  showToast("Demo: form submitted (no backend)");
  closeAuth();
});

// Cart modal events
cartBtnLeft.addEventListener("click", openCart);
cartBtnRight.addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);

document.getElementById("checkout-btn").addEventListener("click", ()=>{
  if(Object.keys(cart).length === 0){
    showToast("Your cart is empty");
    return;
  }
  // Demo: simulate checkout
  showToast("Checkout demo: order placed");
  cart = {};
  saveCart();
  closeCart();
});

// close modals on background click
[cartModal, authModal].forEach(mod => {
  mod.addEventListener("click", (e) => {
    if (e.target === mod) mod.setAttribute("aria-hidden", "true");
  });
});

// Init
renderProducts();
updateCartCounts();
