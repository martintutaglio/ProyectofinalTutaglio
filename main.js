document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("productList");
    const cartCount = document.getElementById("cartCount");
    const cartList = document.getElementById("cartList");
    const totalPrice = document.getElementById("totalPrice");
    const cartButton = document.getElementById("cart");
    const checkoutButton = document.getElementById("checkoutButton");
    const paymentPopup = document.getElementById("paymentPopup");
    const closePopupButton = document.getElementById("closePopup");
    const completePurchaseButton = document.getElementById("completePurchase");
    const successMessage = document.getElementById("successMessage");
    
    let products = [];

    function createProductElement(product) {
        const listItem = document.createElement("li");
        listItem.className = "product-item";
        listItem.innerHTML = `
            <span class="product-name">${product.nombre}</span>
            <span class="product-price">$${product.precio.toFixed(2)}</span>
            <button class="add-to-cart" data-product='${JSON.stringify(product)}'>Agregar al carrito</button>
        `;
        return listItem;
    }

    function displayProducts() {
        productList.innerHTML = "";
        products.forEach(product => {
            const listItem = createProductElement(product);
            productList.appendChild(listItem);
        });
    }

    fetch("./ropa.json")
        .then(response => response.json())
        .then(data => {
            products = data.productosRopa;
            displayProducts();
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
        });

    const cart = {
        items: [],
        addItem: function (product) {
            this.items.push(product);
            sessionStorage.setItem("cartItems", JSON.stringify(this.items));
            console.log("Producto agregado al carrito:", product);
            this.updateCartCount();
            this.displayCartItems();
            this.calculateTotal();
        },
        getItems: function () {
            return JSON.parse(sessionStorage.getItem("cartItems")) || [];
        },
        updateCartCount: function () {
            const itemCount = this.items.length;
            cartCount.textContent = itemCount;
        },
        displayCartItems: function () {
            cartList.innerHTML = "";
            this.items.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = `${item.nombre} - $${item.precio.toFixed(2)}`;
                cartList.appendChild(listItem);
            });
        },
        calculateTotal: function () {
            const total = this.items.reduce((acc, item) => acc + item.precio, 0);
            totalPrice.textContent = `Total: $${total.toFixed(2)}`;
        },
    };

    productList.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart")) {
            const productData = JSON.parse(event.target.getAttribute("data-product"));
            if (productData) {
                cart.addItem(productData);
                console.log("Carrito actual:", cart.getItems());
            }
        }
    });

    cartButton.addEventListener("click", function () {
        console.log("Botón 'Ver Carrito' fue clickeado");
        cart.displayCartItems();
    });

    checkoutButton.addEventListener("click", function () {
        const selectedProductsList = document.getElementById("selectedProducts");
        selectedProductsList.innerHTML = "";

        let totalAmount = 0;

        cart.items.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.nombre} - $${item.precio.toFixed(2)}`;
            selectedProductsList.appendChild(listItem);

            totalAmount += item.precio;
        });

        const totalAmountElement = document.getElementById("totalAmount");

        totalAmountElement.textContent = `Total a pagar: $${totalAmount.toFixed(2)}`;

        paymentPopup.style.display = "block";
    });

    closePopupButton.addEventListener("click", function () {
        paymentPopup.style.display = "none";
    });

    completePurchaseButton.addEventListener("click", function () {
        successMessage.style.display = "block";
        paymentPopup.style.display = "none";

        setTimeout(function () {
            successMessage.style.display = "none";
        }, 3000);
    });

    cart.updateCartCount();
    cart.displayCartItems();
    cart.calculateTotal();
    
    const cartPopup = document.getElementById("cartPopup");
    const closeCartPopup = document.getElementById("closeCartPopup");

    cartButton.addEventListener("click", function () {
        // Mostrar el popup del carrito al hacer clic en "Ver Carrito"
        cartPopup.style.display = "block";

        // Actualizar la lista de productos seleccionados y el total
        const selectedProductsList = document.getElementById("selectedProducts");
        selectedProductsList.innerHTML = "";

        let totalAmount = 0;

        cart.items.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.nombre} - $${item.precio.toFixed(2)}`;
            selectedProductsList.appendChild(listItem);

            totalAmount += item.precio;
        });

        const totalAmountElement = document.getElementById("totalAmount");
        totalAmountElement.textContent = `Total a pagar: $${totalAmount.toFixed(2)}`;
    });

    // Agregar un evento para cerrar el popup del carrito al hacer clic en la "X"
    closeCartPopup.addEventListener("click", function () {
        cartPopup.style.display = "none";
    });
});
