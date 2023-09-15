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

    const products = [
        { id: 1, name: "Remera", price: 500 },
        { id: 2, name: "Pantalones", price: 1200 },
        { id: 3, name: "Championes", price: 4900 },
        { id: 4, name: "Medias", price: 250 },
        { id: 5, name: "Bufanda", price: 300 },
    ];

    // Función para crear un elemento de producto
    function createProductElement(product) {
        const listItem = document.createElement("li");
        listItem.className = "product-item";
        listItem.innerHTML = `
            <span class="product-name">${product.name}</span>
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <button class="add-to-cart" data-product='${JSON.stringify(product)}'>Agregar al carrito</button>
        `;
        return listItem;
    }

    // Función para mostrar productos en la lista
    function displayProducts() {
        productList.innerHTML = "";
        products.forEach(product => {
            const listItem = createProductElement(product);
            productList.appendChild(listItem);
        });
    }

    displayProducts();

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
                listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
                cartList.appendChild(listItem);
            });
        },
        calculateTotal: function () {
            const total = this.items.reduce((acc, item) => acc + item.price, 0);
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
        // Mostrar el carrito de compras de alguna manera, como un modal o una página separada.
        console.log("Botón 'Ver Carrito' fue clickeado");
        cart.displayCartItems();
    });

    checkoutButton.addEventListener("click", function () {
        // Obtener el elemento ul donde se mostrarán los productos seleccionados
        const selectedProductsList = document.getElementById("selectedProducts");
        selectedProductsList.innerHTML = "";

        // Calcular el total de la compra
        let totalAmount = 0;

        // Iterar a través de los productos seleccionados
        cart.items.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            selectedProductsList.appendChild(listItem);

            // Sumar el precio de cada producto al total
            totalAmount += item.price;
        });

        // Obtener el elemento donde se mostrará el total
        const totalAmountElement = document.getElementById("totalAmount");

        // Actualizar el contenido del total
        totalAmountElement.textContent = `Total a pagar: $${totalAmount.toFixed(2)}`;

        // Mostrar el popup
        paymentPopup.style.display = "block";
    });
    

    closePopupButton.addEventListener("click", function () {
        // Ocultar el popup al hacer clic en la "X" (Cerrar)
        paymentPopup.style.display = "none";
    });

    completePurchaseButton.addEventListener("click", function () {
        // Mostrar el mensaje de éxito
        successMessage.style.display = "block";

        // Ocultar el popup
        paymentPopup.style.display = "none";

        // Limpia el carrito después de un pago exitoso si es necesario.
        // cart.clearCart();

        // Oculta automáticamente el mensaje de éxito después de 3 segundos (3000 milisegundos)
        setTimeout(function () {
            successMessage.style.display = "none";
        }, 3000); // 3 segundos
    });

    

    // Actualizar la cantidad de productos en el carrito al cargar la página
    cart.updateCartCount();
    cart.displayCartItems();
    cart.calculateTotal();
});
