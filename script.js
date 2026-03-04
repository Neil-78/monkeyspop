import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCy38mc9aMMuOnppBskF9cJV0-X3wYq0Dc",
    authDomain: "monkeys-df602.firebaseapp.com",
    projectId: "monkeys-df602",
    storageBucket: "monkeys-df602.firebasestorage.app",
    messagingSenderId: "748298117878",
    appId: "1:748298117878:web:bbe95c7998c8c4630682d7",
    measurementId: "G-MRS73LWYCW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let cart = [];

window.addToCart = function(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    
    window.updateCartUI();
    
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.3)';
    setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
}

window.updateCartUI = function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    let count = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;
        
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <small>$${item.price.toFixed(2)} x ${item.quantity}</small>
                </div>
                <div>
                    <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                    <button onclick="window.removeItem(${index})" style="background:none; border:none; color:red; cursor:pointer; margin-left:10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">Tu pedido está vacío 🐒</p>';
    }
    
    cartCount.innerText = count;
    cartTotal.innerText = total.toFixed(2);
}

window.removeItem = function(index) {
    cart.splice(index, 1);
    window.updateCartUI();
}

window.toggleCart = function() {
    document.getElementById('cart-sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

window.checkout = async function() {
    if(cart.length === 0) {
        alert("¡Agrega unas Choconenas o Monkiletas primero!");
        return;
    }

    const nombreCliente = prompt("¿Cuál es tu nombre (o apodo) para entregar el pedido?");
    
    if (!nombreCliente || nombreCliente.trim() === "") {
        alert("Necesitamos tu nombre para ubicarte con tus snacks.");
        return;
    }

    const totalPedido = cart.reduce((suma, item) => suma + (item.price * item.quantity), 0);
    const btnCheckout = document.querySelector('.checkout-btn');
    const textoOriginal = btnCheckout.innerText;
    btnCheckout.innerText = "Enviando pedido...";
    btnCheckout.disabled = true;

    try {
        await addDoc(collection(db, "pedidos"), {
            cliente: nombreCliente.trim(),
            items: cart,
            total: totalPedido,
            estado: "pendiente",
            fecha: serverTimestamp()
        });

        alert(`¡Listo ${nombreCliente}! Tu pedido fue enviado. Te lo llevamos en el receso.`);
        
        cart = [];
        window.updateCartUI();
        window.toggleCart();

    } catch (error) {
        console.error("Error al enviar el pedido: ", error);
        alert("Hubo un error de conexión. Intenta de nuevo.");
    } finally {
        btnCheckout.innerText = textoOriginal;
        btnCheckout.disabled = false;
    }
}

window.updateCartUI();

const observerOptions = { threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section-animate').forEach(section => {
    observer.observe(section);
});

function createFallingBananas() {
    const heroSection = document.getElementById('hero-section');
    const numberOfBananas = 10;

    for (let i = 0; i < numberOfBananas; i++) {
        let banana = document.createElement('img');
        banana.src = 'chocobanana-anim.png';
        banana.classList.add('falling-banana');
        
        banana.style.left = Math.random() * 100 + 'vw';
        banana.style.animationDuration = Math.random() * 5 + 3 + 's';
        banana.style.animationDelay = Math.random() * 5 + 's';

        heroSection.appendChild(banana);
    }
}

window.onload = createFallingBananas;