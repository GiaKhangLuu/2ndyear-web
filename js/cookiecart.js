const INDEXIMG = 0;
const INDEXNAME = 1;
const INDEXQTY = 2;
const INDEXSIZE = 3;
const INDEXPRICE = 4;

var getInfoItem = () => {
    const itemImg = document.getElementsByClassName('section-left')[0].childNodes[1].getAttribute('src');
    const itemQty = document.getElementsByClassName('product_qty')[0].childNodes[3].value;
    const itemName = document.getElementsByClassName('product_title')[0].innerText;
    const itemPrice = document.getElementsByClassName('product_price')[0].innerText;
    var itemSize = document.getElementsByClassName('product_size')[0].childNodes[3].value;
    if(itemSize === undefined) {
        itemSize = 'Free Size';
    }
    return `${itemImg}&${itemName}&${itemQty}&${itemSize}&${itemPrice}`;
}

var setCookieCart = item => {
    const cookieCart = getCookieCart();
    //handle first item has been added
    if(cookieCart === '') {
        document.cookie = 'cart=' + item + '; expires=' + new Date(9999, 0, 1).toUTCString();
        alert('Thêm vào giỏ hàng thành công'); 
        updateQuantity();
        return; 
    }
    //check if same item in cookie
    const cookieCartArr = cookieCart.split(',');
    const itemName = item.split('&')[INDEXNAME];
    const itemSize = item.split('&')[INDEXSIZE];
    const itemQty = item.split('&')[INDEXQTY];
    const indexOfSameItem = findSame(itemName, itemSize, cookieCartArr);
    if(indexOfSameItem !== -1 ) {
        //handle if same item
        const itemToHandled = cookieCartArr[indexOfSameItem]; 
        const newCookieCart = cookieCart.replace(itemToHandled, handleDuplicateItem(itemToHandled, itemQty));
        document.cookie = 'cart=' + newCookieCart + '; expires=' + new Date(9999, 0, 1).toUTCString();
        alert('Thêm vào giỏ hàng thành công'); 
        updateQuantity();
    } else {
        //handle if not same item. Add to last 
        const cookieCartValue = cookieCart + ',' + item;
        document.cookie = 'cart=' + cookieCartValue + '; expires=' + new Date(9999, 0, 1).toUTCString();
        alert('Thêm vào giỏ hàng thành công');
        updateQuantity();
    }
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

var handleDuplicateItem = (cartItem, itemQty) => {
    const regex = /\&([0-9]+)\&/; //capture number between &  &
    let searchValue = regex.exec(cartItem);
    let qty = parseInt(searchValue[1]) + parseInt(itemQty); //regex.exec return array searchValue[0] means '&(value)&', searchValue[1] means value between & &
    return cartItem.replace(searchValue[0], '&' + qty + '&');
}

var findSame = (itemName, itemSize, cookieCartArr) => {
    for(let i = 0; i < cookieCartArr.length; i++) {
        const cookieCartItem = cookieCartArr[i];
        if(itemName === cookieCartItem.split('&')[INDEXNAME] && 
            itemSize === cookieCartItem.split('&')[INDEXSIZE]) {
            return i;
        }
    }
    return -1;
}

var removeFromCart = () => {
    const cartItem = event.target.parentNode.parentNode.parentNode;
    const cartItemName = cartItem.getElementsByClassName('cart-item-info-name')[0].innerHTML;
    const cartItemSize = cartItem.getElementsByClassName('cart-item-info-size')[0].innerHTML;
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
    addToCart();
    updateQuantity();
}

var addToCart = () => {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    if(getCookieCart() === '') {
        updateTotal();
        return;
    }
    const cookieCartArr = getCookieCart().split(',');
    for(let i = 0; i < cookieCartArr.length; i++) {
        const cookieCartItem = cookieCartArr[i];
        const itemInfo = cookieCartItem.split('&');
        const itemImg = itemInfo[INDEXIMG];
        const itemName = itemInfo[INDEXNAME];
        const itemQty = itemInfo[INDEXQTY];
        const itemSize = itemInfo[INDEXSIZE];
        const itemPrice = itemInfo[INDEXPRICE];
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `  <div class="cart-item-img">
                                    <img src="${itemImg}" width="60%px" height="100%px" alt="hinhgiay">
                                </div>
                                <div class="cart-item-info">
                                    <p class="cart-item-info-name" style="font-size: 13px;">${itemName}</p>
                                    <span>Size </span>
                                    <span class="cart-item-info-size">${itemSize}</span>
                                    <p>
                                        <input type="number" value="${itemQty}" 
                                        onchange="quantityChanged()" class="cart-item-info-count">
                                        <span>x</span>
                                        <span class="cart-item-info-price">${itemPrice}</span>
                                    </p>
                                </div>
                                <div class="cart-item-remove">
                                    <button onclick="removeFromCart()" class="btn-remove">
                                        <span class="fa fa-trash-alt"></span>
                                    </button>
                                </div>`;
        cartItems.appendChild(cartItem);
    }
    updateTotal();
}

var updateTotal = () => {
    const cartItems = document.getElementsByClassName('cart-item');
    var total = 0;
    [...cartItems].forEach(item => {
        const price = item.getElementsByClassName('cart-item-info-price')[0].innerText;
        const quantity = item.getElementsByClassName('cart-item-info-count')[0].value;
        total += (currencyToNumber(price) * parseInt(quantity));
    });
    total = numberToCurrency(total);
    document.getElementsByClassName('modal-footer-total')[0].innerText = total;
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
    // subs1 = number.substring(0, number.length - 3 );
    // subs2 = number.substring(number.length - 3);
    // subs = subs1 + '.' + subs2;
    // subs3 = subs.substring(0, subs.length - 7);
    // subs4 = subs.substring(subs.length - 7); 
    // subss = subs3 + '.' + subs4;
    return currency + '₫';
} 

var quantityChanged = () => {
    var input = event.target;
    if(input.value < 1) {
        input.value = 1;
    }
    const cartItem = input.parentNode.parentNode.parentNode;
    const itemImg = cartItem.getElementsByClassName('cart-item-img')[0].childNodes[1].getAttribute('src');
    const itemName = cartItem.getElementsByClassName('cart-item-info-name')[0].innerText;
    const itemSize = cartItem.getElementsByClassName('cart-item-info-size')[0].innerText; 
    const itemPrice = cartItem.getElementsByClassName('cart-item-info-price')[0].innerText; 
    const itemQty = input.value;
    const updateItem = `${itemImg}&${itemName}&${itemQty}&${itemSize}&${itemPrice}`;
    const cookieCart = getCookieCart();
    const cookieCartArr = getCookieCart().split(',');
    const indexOfSameItem = findSame(itemName, itemSize, cookieCartArr);
    const newCookieCart = cookieCart.replace(cookieCartArr[indexOfSameItem], updateItem);
    document.cookie = 'cart=' + newCookieCart + '; expires=' + new Date(9999, 0, 1).toUTCString();
    updateTotal();
    updateQuantity();
    //console.log(itemImg);
}

var buyNow = () => {
    setCookieCart(getInfoItem());
    window.location.href = 'thanhtoan.html';
}

var updateQuantity = () => {
    const cookieCart = getCookieCart();
    if(cookieCart !== '') {
        var qty = 0;
        const cookieCartArr = cookieCart.split(',');
        for(let i = 0; i < cookieCartArr.length; i++) {
            qty += parseInt(cookieCartArr[i].split('&')[INDEXQTY]);
        }
        document.getElementById('qty').innerText = qty;
    } else {
        document.getElementById('qty').innerText = 0;
    }
}

$(document).ready(() => { updateQuantity() });