// get the query string into a easy to use object
const params = (new URL(document.location)).searchParams;
let errors = {};
let quantities = [];

// check if the query string has errors, if so parse it
if (params.has('errors')) {
  errors = JSON.parse(params.get('errors'));
  // get the quantities also to insert into the form to make sticky
  quantities = JSON.parse(params.get('quantities'));
  // Put up an alert box if there are errors
  if(typeof errors['no_quantities'] !== 'undefined') {
    alert(errors['no_quantities']);
  } else{
  alert('Please fix the errors in the form and resubmit');
}
}
let products;
window.onload = async function () {
  // use fetch to retrieve product data from the server
  // once the products have been successfully loaded and formatted as a JSON object
  // display the products on the page
  await fetch('products.json').then(await function (response) {
    if (response.ok) {
      response.json().then(function (json) {
        products = json;
        display_products();
      });
    } else {
      console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
    }
  });
}

// function to perform the filtering of the products
function myFunction() {
  var input, filter, ul, si, a, i, txtValue;
  input = document.getElementById("search_textbox");
  filter = input.value.toUpperCase();
  si = document.getElementsByTagName("section");
  for (i = 0; i < si.length; i++) {
    a = si[i].getElementsByTagName("h2")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      si[i].style.display = "";
    } else {
      si[i].style.display = "none";
    }
  }
}


function display_products() {
  for (i = 0; i < products.length; i++) {
    let quantity_label = 'Quantity';
    if( (typeof errors['quantity'+i]) != 'undefined' ) {
      quantity_label = `<font class="error_message">${errors['quantity'+i].join('<br>')}</font>`;
    }
    let quantity = 0;
    // put previous quantity in textbox if it exists
    if((typeof quantities[i]) != 'undefined') {
      quantity = quantities[i];
    }
    products_main_display.innerHTML += `
<section class="item">
                <h2>${products[i].name}</h2>
                <p>$${products[i].price}</p>
                <label>${quantity_label}</label>
                <input type="text" placeholder="0" name="quantity_textbox[${i}]" value="${quantity}">
                <img src="C:\Users\jonat\Downloads\Assignment-1-main\Assignment-1-main\public\images">
            </section>
`;
  }
}

// Checks if the user is logged in after they click the purchase button
function isLoggedIn() {
  // Assuming sessionStorage or a similar mechanism to check login status
  return sessionStorage.getItem('isLoggedIn') === 'true';
}

function addToCart(productName) {
  if (!isLoggedIn()) {
    alert('Please register or login to make a purchase.');
    window.location.href = 'login.html'; // Redirect to login page
    return; // Stop further execution
  }

  var quantityInput = document.getElementById('quantity_' + productName);
  var quantity = parseInt(quantityInput.value);
  if (quantity > 0) {
    cart[productName] = (cart[productName] || 0) + quantity;
    alert('Added ' + quantity + ' ' + productName + ' to cart!');
  } else {
    alert('Please enter a valid quantity.');
  }
}