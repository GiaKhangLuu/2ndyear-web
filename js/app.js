//get the modal
const modal = document.getElementById('myModal');

//get the button to open the modal
const cart = document.getElementById('myCart');

//when user clicks open the model
cart.onclick = function() {
    modal.style.display = "block";
    addToCart();
}

//when user clicks everywhere outside of the modal, close it
window.onclick = function(event) {
    if(event.target == modal) {{
         modal.style.display = "none";
    }}
}

