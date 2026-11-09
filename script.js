const foods = [
  {id:1,name:"Margherita Pizza",category:"Pizza",price:8.99,description:"Fresh tomato, mozzarella, basil.",image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Classic Cheeseburger",category:"Burger",price:6.99,description:"Beef patty, cheese, lettuce, tomato.",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Fried Chicken",category:"Chicken",price:7.99,description:"Crispy chicken with golden fries.",image:"https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Alfredo Pasta",category:"Pasta",price:6.50,description:"Creamy sauce with parmesan.",image:"https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Coca Cola",category:"Drinks",price:1.50,description:"Chilled and refreshing.",image:"https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Chocolate Cake",category:"Dessert",price:3.50,description:"Rich and delicious chocolate cake.",image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Grilled Chicken Bowl",category:"Chicken",price:7.50,description:"Grilled chicken with fresh salad.",image:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"French Fries",category:"Burger",price:2.50,description:"Crispy golden fries.",image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"},
  {id:9,name:"Pepperoni Pizza",category:"Pizza",price:9.50,description:"Pepperoni, cheese and tomato sauce.",image:"https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80"},
  {id:10,name:"Fruit Smoothie",category:"Drinks",price:2.75,description:"A cool blend of fresh fruit.",image:"https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=700&q=80"},
  {id:11,name:"Pancake Stack",category:"Dessert",price:4.25,description:"Fluffy pancakes with sweet syrup.",image:"https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=700&q=80"},
  {id:12,name:"Chicken Pasta",category:"Pasta",price:7.25,description:"Pasta tossed with grilled chicken.",image:"https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=80"}
];

let cart = {};
let activeCategory = "All";
let searchTerm = "";
const foodGrid = document.getElementById("foodGrid");
const cartItems = document.getElementById("cartItems");
const toast = document.getElementById("toast");

function money(amount) { return "$" + amount.toFixed(2); }
function renderFoods() {
  const visible = foods.filter(food =>
    (activeCategory === "All" || food.category === activeCategory) &&
    (food.name.toLowerCase().includes(searchTerm) || food.description.toLowerCase().includes(searchTerm))
  );
  document.getElementById("resultCount").textContent = `${visible.length} items`;
  foodGrid.innerHTML = visible.map(food => `
    <article class="food-card">
      <img src="${food.image}" alt="${food.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80'">
      <div class="food-info">
        <h3>${food.name}</h3><p>${food.description}</p>
        <div class="price">${money(food.price)}</div>
        <button class="add-btn" onclick="addToCart(${food.id})">🛒 &nbsp; Add to Cart</button>
      </div>
    </article>`).join("");
  if (!visible.length) foodGrid.innerHTML = '<p>No food found. Try another search.</p>';
}
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  showToast(`${foods.find(food => food.id === id).name} added to cart`);
}
function changeQty(id, amount) {
  cart[id] = (cart[id] || 0) + amount;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}
function removeItem(id) { delete cart[id]; renderCart(); }
function renderCart() {
  const entries = Object.entries(cart);
  const count = entries.reduce((sum, [,qty]) => sum + qty, 0);
  const subtotal = entries.reduce((sum, [id,qty]) => sum + foods.find(food => food.id === Number(id)).price * qty, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartCountSide").textContent = count;
  document.getElementById("subtotal").textContent = money(subtotal);
  document.getElementById("total").textContent = money(subtotal + (count ? 2 : 0));
  document.getElementById("delivery").textContent = money(count ? 2 : 0);
  if (!entries.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add something delicious!</p>';
    return;
  }
  cartItems.innerHTML = entries.map(([id,qty]) => {
    const food = foods.find(item => item.id === Number(id));
    return `<div class="cart-row">
      <img src="${food.image}" alt="${food.name}">
      <div class="cart-product"><strong>${food.name}</strong><span class="item-price">${money(food.price * qty)}</span>
        <div class="qty-controls"><button aria-label="Decrease quantity" onclick="changeQty(${food.id},-1)">−</button><span>${qty}</span><button aria-label="Increase quantity" onclick="changeQty(${food.id},1)">+</button></div>
      </div>
      <button class="remove-item" aria-label="Remove ${food.name}" onclick="removeItem(${food.id})">×</button>
    </div>`;
  }).join("");
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".category.active")?.classList.remove("active");
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderFoods();
  });
});
document.getElementById("searchInput").addEventListener("input", event => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderFoods();
});
document.getElementById("cartJump").addEventListener("click", () => document.getElementById("cart").scrollIntoView({behavior:"smooth",block:"start"}));
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!Object.keys(cart).length) return showToast("Your cart is empty. Add food before checkout.");
  const count = Object.values(cart).reduce((sum,qty) => sum + qty, 0);
  showToast(`Order ready! ${count} item(s) in your cart. Connect a backend to place real orders.`);
});
renderFoods();
renderCart();
