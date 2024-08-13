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

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});