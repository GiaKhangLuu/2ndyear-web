const INDEX_ITEM_IMG = 0;
const INDEX_ITEM_NAME = 1;
const INDEX_ITEM_QTY = 2;
const INDEX_ITEM_SIZE = 3;
const INDEX_ITEM_PRICE = 4;

const INDEX_CUSTOMER_NAME = 2;

$(document).ready(() => {
    const customer = getCookieCustomer();
    if(customer !== '') {
        document.getElementById('hello').innerText =
        `Xin chào ${customer.split('&')[INDEX_CUSTOMER_NAME]}. Mong bạn mua sắm tại K&K Sneaker vui vẻ`;
    }
    addToCartPage();
});

const addToCartPage = () => {
    const cart = document.getElementsByClassName('cart-items')[0];
    cart.innerHTML = '';
    const cookieCart = getCookieCart();
    if(cookieCart === '') {
        updateTotal();
        return;
    }
    const cookieCartArr = cookieCart.split(',');
    var price = 0;
    for(let i = 0; i < cookieCartArr.length; i++) {
        const cookieCartItem = cookieCartArr[i];
        const itemInfo = cookieCartItem.split('&');
        const item = document.createElement('div');
        item.classList.add('cart-item'); 
        item.innerHTML = `  <div class="cart-item-img">
                                <img src="${itemInfo[INDEX_ITEM_IMG]}" height="100%" width="120px" alt="">
                            </div>
                            <div class="cart-item-name">
                                <span>${itemInfo[INDEX_ITEM_NAME]}<span>
                            </div>
                            <div class="cart-item-size">
                                <span>${itemInfo[INDEX_ITEM_SIZE]}</span>
                            </div>
                            <div class="cart-item-qty">
                                <input type="number" onchange="quantityChanged()" value="${itemInfo[INDEX_ITEM_QTY]}"> 
                            </div>
                            <div class="cart-item-price">
                                <span>${itemInfo[INDEX_ITEM_PRICE]}</span>
                            </div> 
                            <div class="cart-item-remove">
                                <button onclick="removeFromCart()" class="btn-remove">
                                    <span class="fa fa-trash-alt"></span>
                                </button>
                            </div>`;
        cart.appendChild(item);
        var number = currencyToNumber(itemInfo[INDEX_ITEM_PRICE]);
        var price = number * parseInt(itemInfo[INDEX_ITEM_QTY]);
    }
    document.getElementsByClassName('total')[0].innerText = numberToCurrency(price);
    updateTotal();
}

var currencyToNumber = currency => parseInt(currency.replace(/[.]/g,'').replace('₫',''));

var numberToCurrency = number => {
    number = number.toString();
    let currency = number;
    let numberOfDot = parseInt((number.length - 1) / 3);
    let endIndex = 0;
    for(let count = 0; count < numberOfDot; count++) {
        endIndex += 3 + count; //
        currency = currency.substring(0, currency.length - endIndex) + '.' + currency.substring(currency.length - endIndex);
    }
    return currency + '₫';
} 

var getCookieCart = () => {
    const cookieArr = document.cookie.split(';');
    var cookieCart = '';
    for(let i = 0; i < cookieArr.length; i++) {
        var cookieValue = cookieArr[i];
        while (cookieValue.charAt(0) == ' ') {
          cookieValue = cookieValue.substring(1);
        }
        if (cookieValue.indexOf('cart') == 0) {
            cookieCart = cookieValue;
        }
    }
    //handle if cart is empty
    if(cookieCart === '') {
        return '';
    }
    const cookieCartPair = cookieCart.split('=');
    const cookieCartValue = cookieCartPair[1];
    return cookieCartValue;
}

var findSame = (itemName, itemSize, cookieCartArr) => {
    for(let i = 0; i < cookieCartArr.length; i++) {
        const cookieCartItem = cookieCartArr[i];
        if(itemName === cookieCartItem.split('&')[INDEX_ITEM_NAME] &&
            itemSize === cookieCartItem.split('&')[INDEX_ITEM_SIZE]) {
            return i;
        }
    }
    return -1;
}

var removeFromCart = () => {
    const cartItem = event.target.parentNode.parentNode.parentNode;
    const cartItemName = cartItem.getElementsByClassName('cart-item-name')[0].innerText; 
    const cartItemSize = cartItem.getElementsByClassName('cart-item-size')[0].innerText;
    const cookieCartArr = getCookieCart().split(',');
    const indexOfItemToRemove = findSame(cartItemName, cartItemSize, cookieCartArr);
    if(indexOfItemToRemove !== -1) {
        document.cookie = "cart=";
        let cookieValue = "";
        for(let i = 0; i < cookieCartArr.length; i++) {
            if(i === indexOfItemToRemove) {
                continue;
            }
            cookieValue += cookieCartArr[i] + ','
        }
        cookieValue = cookieValue.substr(0, cookieValue.length - 1) //remove ',' from cookieValue
        document.cookie = "cart=" + cookieValue + '; expires=' + new Date(9999, 0, 1).toUTCString();
    }
    addToCartPage();
}

var updateTotal = () => {
    const cartItems = document.getElementsByClassName('cart-item');
    var total = 0;
    [...cartItems].forEach(item => {
        const price = item.getElementsByClassName('cart-item-price')[0].innerText;
        const quantity = item.getElementsByClassName('cart-item-qty')[0].childNodes[1].value;
        total += (currencyToNumber(price) * parseInt(quantity));
    });
    document.getElementsByClassName('total')[0].innerText = numberToCurrency(total);
}

var quantityChanged = () => {
    var input = event.target;
    if(input.value < 1) {
        input.value = 1;
    }
    const itemInfo = input.parentNode.parentNode;
    const itemImg = itemInfo.getElementsByClassName('cart-item-img')[0].childNodes[1].getAttribute('src');
    const itemName = itemInfo.getElementsByClassName('cart-item-name')[0].innerText;
    const itemPrice = itemInfo.getElementsByClassName('cart-item-price')[0].innerText;
    const itemSize = itemInfo.getElementsByClassName('cart-item-size')[0].innerText;
    const itemQty = input.value;
    const updateItem = `${itemImg}&${itemName}&${itemQty}&${itemSize}&${itemPrice}`;
    const cookieCart = getCookieCart();
    const cookieCartArr = getCookieCart().split(',');
    const indexOfSameItem = findSame(itemName, itemSize, cookieCartArr);
    const newCookieCart = cookieCart.replace(cookieCartArr[indexOfSameItem], updateItem);
    document.cookie = 'cart=' + newCookieCart + '; expires=' + new Date(9999, 0, 1).toUTCString();
    updateTotal();
}

const goShopping = () => { window.location.href = 'trangchu.html'; };

const checkOut = () => { window.location.href = 'thanhtoan.html'; };

const getCookieCustomer = () => {
    const cookieArr = document.cookie.split(';');
    var cookieCustomer = '';
    for(let i = 0; i < cookieArr.length; i++) {
        var cookieValue = cookieArr[i];
        while (cookieValue.charAt(0) == ' ') {
          cookieValue = cookieValue.substring(1);
        }
        if (cookieValue.indexOf('customer') == 0) {
            cookieCustomer = cookieValue;
        }
    }
    if(cookieCustomer === '') {
        return '';
    }
    const cookieCustomerPair = cookieCustomer.split('=');
    const cookieCustomerValue = cookieCustomerPair[1];
    return cookieCustomerValue;
}