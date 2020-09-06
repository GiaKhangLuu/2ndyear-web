const INDEX_ACCOUNT = 0;
const INDEX_ACCOUNT_PASS = 1;
const INDEX_ACCOUNT_NAME = 2;
const INDEX_ACCOUNT_PHONE = 3;
const INDEX_ACCOUNT_EMAIL = 4;
const INDEX_ACCOUNT_ADDRESS = 5;

const signUp = () => {
    const account = document.getElementById('account').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value; 
    if(checkEmpty([account, password, password2, name, phone, email, address]) || password !== password2) {
        if(checkEmpty([account, password, password2, name, phone, email, address])) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        } 
        alert('Nhập lại mật khẩu không đúng');
        return;
    }
    const value = `${account}&${password}&${name}&${phone}&${email}&${address}`;
    var cookieAccount = getCookieAccount();
    if(cookieAccount !== '') {
        const cookieAccountArr = cookieAccount.split(',');
        for(let i = 0; i < cookieAccountArr.length; i++) {
            const accountInfo = cookieAccountArr[i];
            if(account === accountInfo.split('&')[INDEX_ACCOUNT]) {
                alert('Tên tài khoản đã tồn tại');
                return;
            }
        }
        const newValue = cookieAccount + ',' + value;
        document.cookie = "account=" + newValue + '; expires=' + new Date(9999, 0, 1).toUTCString(); 
        alert('Đăng ký thành công');
        window.location.href = 'dangnhap.html';
    } else {
        document.cookie = "account=" + value + '; expires=' + new Date(9999, 0, 1).toUTCString();
    }
}

const checkEmpty = arr => {
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] === '') {
            return true;
        }
    }
    return false;
}

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


