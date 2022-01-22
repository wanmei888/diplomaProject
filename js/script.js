let carts = document.querySelectorAll('.add-cart');


let products = [{
        name: 'Торт без глютена с цветами и ягодами',
        tag: 'tort-bez-gljutena-1',
        price: 1220,
        inCart: 0
    }, {
        name: 'Розовый торт без глютена с черникой',
        tag: 'tort-bez-gljutena-2',
        price: 1360,
        inCart: 0
    }, {
        name: 'Бело-розовый торт без глютена с клубникой',
        tag: 'tort-bez-gljutena-3',
        price: 1340,
        inCart: 0
    }, {
        name: 'Торт без глютена с открытыми коржами',
        tag: 'tort-bez-gljutena-4',
        price: 1380,
        inCart: 0
    },
    {
        name: 'Торт без глютена с клубникой и малиной',
        tag: 'tort-bez-gljutena-5',
        price: 1240,
        inCart: 0
    },
    {
        name: 'Торт без глютена с черникой',
        tag: 'tort-bez-gljutena-6',
        price: 1350,
        inCart: 0
    },
];

for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    });
}

function onLoadNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}



function cartNumbers(product) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);
}


function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if (cartItems != null) {
        if (cartItems[product.name] == undefined) {
            cartItems = {
                ...cartItems,
                [product.name]: product
            };
        }
        cartItems[product.name].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = {
            [product.name]: product
        };
    }
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product) {
    //  console.log("the product is", product.price);
    let cartCost = localStorage.getItem('totalCost');

    console.log("My cart cost is", cartCost);

    if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + product.price);
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector(".products");


    if (cartItems && productContainer) {
        productContainer.innerHTML = '';

        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
				<div class="products"><ion-icon name="close-circle"></ion-icon><img src="./img/${item.tag}.jpg"/>
				<span>${item.name}</span></div>
				<div class="price sm-hide">$${item.price},00</div>
				<div class="quantity">
                <ion-icon class="decrease " name="arrow-dropleft-circle"></ion-icon>
                    <span>${item.inCart}</span>
                <ion-icon class="increase" name="arrow-dropright-circle"></ion-icon>   
            </div>
            <div class="total">$${item.inCart * item.price},00</div>`;

        });
        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">Итоговая сумма:</h4>
                <h4 class="basketTotal">$${cart},00</h4>
            </div>`

        deleteButtons();
        manageQuantity();
    }

}

function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let currentQuantity = 0;
    let currentProduct = '';
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    for (let i = 0; i < increaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            console.log(cartItems);
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g, '').trim();
            console.log(currentProduct);

            if (cartItems[currentProduct].inCart > 1) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], "decrease");
                totalCost(cartItems[currentProduct], "decrease");
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        });

        increaseButtons[i].addEventListener('click', () => {
            console.log(cartItems);
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g, '').trim();
            console.log(currentProduct);

            cartItems[currentProduct].inCart += 1;
            cartNumbers(cartItems[currentProduct]);
            totalCost(cartItems[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();
        });
    }
}

function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartCost = localStorage.getItem("totalCost");
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productName;
    console.log(cartItems);

    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            productName = deleteButtons[i].parentElement.textContent.toLocaleLowerCase().replace(/ /g, '').trim();

            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
            localStorage.setItem('totalCost', cartCost - (cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            displayCart();
            onLoadCartNumbers();
        });
    }
}





onLoadNumbers();
displayCart();