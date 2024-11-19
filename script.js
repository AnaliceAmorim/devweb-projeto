//COMENTAR ESSE EVENTO SE FOR TESTAR O JAVASCRIPT SE O BANCO NAO FUNCIONAR
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromServer();
});

const cartButton = document.getElementById('cart-nav');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');
cartButton.addEventListener('click', () => {
    sidebar.classList.add('show');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('show');
});

//MODAL
const modal = document.getElementById('modal-container');
const continueButton = document.querySelector('.btn-continuar');
const addressForm = document.getElementById('address-form');
let modalShown = false;

function openModal() {
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

function validateForm() {
    const bairro = document.getElementById('bairro').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const telefone = document.getElementById('telefone').value;
    return bairro && rua && numero && telefone;
}

const cartButtons = document.querySelectorAll('.cart-button');
cartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        if (!modalShown) {
            openModal();
            modalShown = true;
        }
    });
});

continueButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (validateForm()) {
        closeModal();
    } else {
        alert("Por favor, preencha todos os campos para continuar.");
    }
});

//FUNCIONALIDADES CARRINHO
let cart = [];
/*function addItemToCart(name, price) {
    let item = cart.find(item => item.name === name);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}
    
function updateItemQuantity(name, action) {
    let item = cart.find(item => item.name === name);
    if (item) {
        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease') {
            item.quantity--;
            if (item.quantity === 0) {
                // Remove o item do carrinho se a quantidade for 0
                cart = cart.filter(cartItem => cartItem.name !== name);
            }
        }
        updateCart();
    }
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; 
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name}
                        <div class="contador">
                            <i class="fas fa-minus" onclick="updateItemQuantity('${item.name}', 'decrease')"></i>
                            <span>${item.quantity}</span>
                            <i class="fas fa-plus" onclick="updateItemQuantity('${item.name}', 'increase')"></i>
                        </div>
                        R$${(item.price * item.quantity).toFixed(2)}`;
        cartItemsContainer.appendChild(li);
        total += item.price * item.quantity;
    });
    document.getElementById('total').innerText = `Total: R$${total.toFixed(2)}`;
}

const realizarPedidoButton = document.getElementById('realizar-btn');
realizarPedidoButton.addEventListener('click', () => {
    if (cart.length > 0) {
        alert("Pedido realizado com sucesso! Obrigado e volte sempre.");
        cart = [];
        updateCart();
    } else {
        alert("Adicione itens antes de realizar o pedido.");
    }
});*/
function addItemToCart(name, price) {
    fetch('crud/adicionar_carrinho.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, price: price, quantity: 1 })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            loadCartFromServer();
        })
        .catch(error => console.error('Erro ao adicionar ao carrinho:', error));
}

function updateItemQuantity(name, action) {
    let quantityChange = action === 'increase' ? 1 : -1;

    fetch('crud/atualizar_carrinho.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, change: quantityChange })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            loadCartFromServer();
        })
        .catch(error => console.error('Erro ao atualizar quantidade:', error));
}

async function loadCartFromServer() {
    try {
        const response = await fetch('crud/visualizar_carrinho.php');
        if (!response.ok) {
            throw new Error('Erro ao carregar o carrinho');
        }
        const data = await response.json();
        cart = data;
        updateCart();
    } catch (error) {
        console.error('Erro ao carregar o carrinho:', error);
    }
}

async function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name}
                        <div class="contador">
                            <i class="fas fa-minus" onclick="updateItemQuantity('${item.name}', 'decrease')"></i>
                            <span>${item.quantity}</span>
                            <i class="fas fa-plus" onclick="updateItemQuantity('${item.name}', 'increase')"></i>
                        </div>
                        R$${(item.price * item.quantity).toFixed(2)}`;
        cartItemsContainer.appendChild(li);
        total += item.price * item.quantity;
    });

    document.getElementById('total').innerText = `Total: R$${total.toFixed(2)}`;
}

document.querySelectorAll('.cart-button').forEach(button => {
    button.addEventListener('click', () => {
        const itemName = button.getAttribute('data-item');
        const itemPrice = parseFloat(button.getAttribute('data-price'));
        addItemToCart(itemName, itemPrice);
    });
});

realizarPedidoButton.addEventListener('click', () => {
    if (cart.length > 0) {
        fetch('crud/limpar_carrinho.php', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                alert("Pedido realizado com sucesso! Obrigado e volte sempre.");
                cart = [];
                updateCart();
            })
            .catch(error => console.error('Erro ao realizar pedido:', error));
    } else {
        alert("Adicione itens antes de realizar o pedido.");
    }
});