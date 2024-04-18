//const users_reg_data = require(__dirname + '.user_data.json')
const fs = require('fs');

const user_data_file = __dirname + '/user_data.json';

//check that user file exists and read in if it does
let users_reg_data = {};
if(fs.existsSync(user_data_file)) {
  const data = fs.readFileSync(user_data_file,'utf-8');
   users_reg_data = JSON.parse(data);
 let stats = fs.statSync(user_data_file);
 console.log(`${user_data_file} has ${stats.size} characters`)

}
console.log(users_reg_data);
// ^^^this is the lab code that was copied from ex1.js ^

// loads the products array into server memory from the products.json file
const products = require(__dirname + '/products.json');

const express = require('express');
const app = express();

const myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));

app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});



app.post("/login", function (request, response) {
  //accessing the request body
  const logindata = request.body;
  //log the proccess the login data here(authenticated user)
  console.log('login data:',logindata);

  response.json(loginData);

  // Process login form POST and redirect to logged in page if ok, back to login page if not

});
//same code for login but now for register below
app.post("/login", function (request, response) 

// A micro-service to return the products data currently in memory on the server as
// javascript to define the products array
app.get('/products.json', function (req, res, next) {
  res.json(products);
});

// A micro-service to process the product quantities from the form data
// redirect to invoice if quantities are valid, otherwise redirect back to products_display
app.post('/process_purchase_form', function (req, res, next) {
  // only process if purchase form submitted
  const errors = { }; // assume no errors to start
  let quantities = [];
  if (typeof req.body['quantity_textbox'] != 'undefined') {
     quantities = req.body['quantity_textbox'];
    // validate that all quantities are good are non neg int
    let has_quantities = false;
    for (let i in quantities) {
      if (!isNonNegInt(quantities[i])) {
        errors['quantity' + i] = isNonNegInt(quantities[i], true);
      }
      if(quantities[i]>0){
        has_quantities = true;
      }
    }
    // if no quantities >0 then make a no_quantities error
    if(has_quantities === false) {
errors['no_quantities']= 'Must select some games';
    }
    console.log(Date.now() + ': Purchase made from ip ' + req.ip + ' data: ' + JSON.stringify(req.body));
  }

  // create a query string with data from the form
  const params = new URLSearchParams();
  params.append('quantities', JSON.stringify(quantities));

  // If there are errors, send user back to fix otherwise send to invoice
  if(Object.keys(errors).length > 0) {
    // Have errors, redirect back to store where errors came from to fix and try again
    params.append('errors', JSON.stringify(errors));
    res.redirect( 'store.html?' + params.toString());
  } else {
    res.redirect('./invoice.html?' + params.toString());
  }

});

app.use(express.static(__dirname + '/public'));
app.listen(8080, () => console.log(`listening on port 8080`));


function isNonNegInt(q, returnErrors = false) {
  errors = []; // assume no errors at first
  if(q == '') q = 0; // handle blank inputs as if they are 0
  if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
  else {
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
  }
  return returnErrors ? errors : (errors.length == 0);
}


// login page 
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Serve login.html when the user accesses the root URL
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Route to handle login data
app.post('/login', (req, res) => {
  // Respond with the login data received
  res.send(req.body);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



//registraion page. smae but different names 


// Add this route for registration
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.post('/register', (req, res) => {
  // Respond with the registration data received
  res.send(req.body);
});
