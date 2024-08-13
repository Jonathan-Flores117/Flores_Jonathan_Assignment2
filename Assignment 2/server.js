const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const session = require('express-session');

const user_data_file = __dirname + '/user_data.json';
let user_data = {};

// Load user data from JSON file
try {
  user_data = JSON.parse(fs.readFileSync(user_data_file, 'utf8'));
} catch (err) {
  console.error('Error loading user data:', err);
}

app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'your_long_random_secret_string_here',  // Change this to a long, random string
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true if using https
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});



app.post("/process_login", function (request, response) {
  //accessing the request body
console.log(request.body);
let errors = {}
//log the proccess the login data here(authenticated user)
let email =request.body["email"];
let password = request.body["password"];
if (email in users_reg_data) {
  //check if pass matches
  if(password === users_reg_data[email]){
//pass ok send to invoice
//give user cookie with email
res.cookie('login_email', req.body.email);
res.redirect('./invoice.hmtl?'+ params.toString());
return;
    console.log(`${email} is logged in`);
  }
} else {
  errors['no_user'] = `${email} not register`;
}
}
,
response.json(errors));
{
  // Process login form POST and redirect to logged in page if ok, back to login page if not

};
//same code for login but now for register below
app.post("/process_register", function (request, response)



// A micro-service to return the products data currently in memory on the server as
// javascript to define the products array
{app.get('/products.json', function (req, res, next) {
  res.json(products);
// Registration route
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/registration.html");
});

// Registration form handling
app.post("/register", (req, res) => {
  // ... (your existing code)
});

// Login route
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// Login form handling
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username exists
  if (!user_data[username]) {
    return res.status(400).send("User does not exist.");
  }

  // Check if password is correct
  if (!bcrypt.compareSync(password, user_data[username].password)) {
    return res.status(400).send("Incorrect password.");
  }

  // Set session variables
  req.session.user = {
    username: username,
    email: user_data[username].email
  };

  // Redirect to invoice page or wherever you want to go after successful login
  res.redirect("/invoice.html");
});

// Add a logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});

// Add a middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Use the middleware for protected routes
app.get('/invoice.html', isLoggedIn, (req, res) => {
  res.sendFile(__dirname + '/invoice.html');
});

// Purchase form handling
app.post('/process_purchase_form', isLoggedIn, (req, res) => {
  // Validate product quantities
  const quantities = req.body.quantity_textbox.map(Number);
  if (quantities.some(qty => isNaN(qty) || qty < 0)) {
    return res.status(400).send("Invalid quantity values.");
  }
  if (quantities.every(qty => qty === 0)) {
    return res.status(400).send("Please select at least one product.");
  }

  // Process purchase form here
  // Redirect to invoice page or wherever you want to go after successful purchase
  res.redirect("/invoice.html");
});

// Serve static files
app.use(express.static('public'));


//registraion page. smae but different names 


// Add this route for registration
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.post('/register', (req, res) => {
  // Respond with the registration data received
  res.send(req.body);
});
})


function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
