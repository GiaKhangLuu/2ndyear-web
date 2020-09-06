const INDEX_CUSTOMER_ACCOUNT = 0;
const INDEX_CUSTOMER_PASS = 1;
const INDEX_CUSTOMER_NAME = 2;
const INDEX_CUSTOMER_PHONE = 3;
const INDEX_CUSTOMER_EMAIL = 4;

const getCookieAccount = () => {
    const cookieArr = document.cookie.split(';');
    var cookieAccount = '';
    for(let i = 0; i < cookieArr.length; i++) {
        var cookieValue = cookieArr[i];
        while (cookieValue.charAt(0) == ' ') {
          cookieValue = cookieValue.substring(1);
        }
        if (cookieValue.indexOf('account') == 0) {
            cookieAccount = cookieValue;
        }
    }
    if(cookieAccount === '') {
        return '';
    }
    const cookieAccountPair = cookieAccount.split('=');
    const cookieAccountValue = cookieAccountPair[1];
    return cookieAccountValue;
} 

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

const signUp = () => {
    const account = document.getElementById('account').value;
    const password = document.getElementById('password').value;
    const cookieAccount = getCookieAccount();
    if(cookieAccount === '') {
        alert('Tài khoản hoặc mật khẩu không đúng');
        return;
    }
    const cookieAccountArr = cookieAccount.split(',');
    for(let i = 0; i < cookieAccountArr.length; i++) {
        const accountInfo = cookieAccountArr[i].split('&');
        if(account === accountInfo[INDEX_CUSTOMER_ACCOUNT] 
            && password === accountInfo[INDEX_CUSTOMER_PASS]) {
                document.cookie = "customer=" + cookieAccountArr[i] + '; expires=' + new Date(9999, 0, 1).toUTCString();
                alert('Đăng nhập thành công');
                window.location.href = 'trangchu.html';
                return;
            }
    }
    alert('Tài khoản hoặc mật khẩu không đúng');
}

const signOut = () => {
    document.cookie = "customer=";
    window.location.href = 'dangnhap.html';
}

$(document).ready(() => {
    const customer = getCookieCustomer();
    if(customer !== '') {
        document.getElementById('hello').innerText =
        `Xin chào ${customer.split('&')[INDEX_CUSTOMER_NAME]}. Mong bạn mua sắm tại K&K Sneaker vui vẻ`;
    }
});