const INDEX_ITEM_IMG = 0;
const INDEX_ITEM_NAME = 1;
const INDEX_ITEM_QTY = 2;
const INDEX_ITEM_SIZE = 3;
const INDEX_ITEM_PRICE = 4;

const INDEX_CUSTOMER_ACCOUNT = 0;
const INDEX_CUSTOMER_PASS = 1;
const INDEX_CUSTOMER_NAME = 2;
const INDEX_CUSTOMER_PHONE = 3;
const INDEX_CUSTOMER_EMAIL = 4;
const INDEX_CUSTOMER_ADDRESS = 5;

$(document).ready(() => {
    addCustomerToCheckOutPage();
    addCartToCheckOutPage();
});

const addCartToCheckOutPage = () => {
    //in case just 1 cookie 
    const cookieCart = getCookieCart();
    if(cookieCart === '') {
        return;
    }
    const cookieCartArr = cookieCart.split(',');
    const cartBody = document.getElementsByClassName('cart-body')[0];
    const shipPrice = 30000;
    var tempPrice = 0;
    for(let i = 0; i < cookieCartArr.length; i++) {
        const cookieCartItem = cookieCartArr[i];
        const cookieCartItemInfo = cookieCartItem.split('&');
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-body-item');
        cartItem.innerHTML = `  <div class="cart-body-item-img">
                                    <img src="${cookieCartItemInfo[INDEX_ITEM_IMG]}" width="70%" height="100%" alt="">
                                </div>
                                <div class="cart-body-item-name">
                                    <span>${cookieCartItemInfo[INDEX_ITEM_NAME]}</span>
                                </div>
                                <div class="cart-body-item-size">
                                    <span>${cookieCartItemInfo[INDEX_ITEM_SIZE]}</span>
                                </div>
                                <div class="cart-body-item-qty">
                                    <span>${cookieCartItemInfo[INDEX_ITEM_QTY]}</span>
                                </div>
                                <div class="cart-body-item-price">
                                    <span>${cookieCartItemInfo[INDEX_ITEM_PRICE]}</span>
                                </div> `;
        cartBody.appendChild(cartItem);
        var number = currencyToNumber(cookieCartItemInfo[INDEX_ITEM_PRICE]);
        var price = number * parseInt(cookieCartItemInfo[INDEX_ITEM_QTY]);
        tempPrice += price;
    }
    const totalPrice = tempPrice + shipPrice;
    document.getElementById('temp-price').innerHTML = numberToCurrency(tempPrice);
    document.getElementById('ship-price').innerHTML = numberToCurrency(shipPrice);
    document.getElementById('total-price').innerHTML = numberToCurrency(totalPrice);
}

var currencyToNumber = currency => parseInt(currency.replace(/[.]/g,'').replace('₫',''));

var numberToCurrency = number => {
    number = number.toString();
    let currency = number;
    let numberOfDot = parseInt((number.length - 1) / 3);
    let endIndex = 0;
    for(let count = 0; count < numberOfDot; count++) {
        endIndex += 3 + count;
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

var getCookieCustomer = () => {
    const cookieArr = document.cookie.split(';');
    var cookieCart = '';
    for(let i = 0; i < cookieArr.length; i++) {
        var cookieValue = cookieArr[i];
        while (cookieValue.charAt(0) == ' ') {
          cookieValue = cookieValue.substring(1);
        }
        if (cookieValue.indexOf('customer') == 0) {
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



const complete = () => {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value; 
    if(getCookieCart() === '' || checkEmpty([name, phone, address, email])) {
        if(getCookieCart() === '') {
            alert('GIỎ HÀNG CỦA BẠN ĐANG TRỐNG');
        } else {
            alert('VUI LÒNG ĐIỀN ĐẦY ĐỦ THÔNG TIN');
        }
    } else {
        document.cookie = "cart=";
        window.location.href = 'hoantat.html';
    }
};

const checkEmpty = arr => {
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] === '') {
            return true;
        }
    }
    return false;
}

const addCustomerToCheckOutPage = () => {
    const customer = getCookieCustomer();
    if(customer !== '') {
        const value = customer.split('&');
        document.getElementById('name').value = value[INDEX_CUSTOMER_NAME];
        document.getElementById('phone').value = value[INDEX_CUSTOMER_PHONE];
        document.getElementById('address').value = value[INDEX_CUSTOMER_ADDRESS];
        document.getElementById('email').value = value[INDEX_CUSTOMER_EMAIL];
    }
}