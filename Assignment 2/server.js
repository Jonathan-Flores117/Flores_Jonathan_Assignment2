const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');

const user_data_file = __dirname + '/user_data.json';
let user_data = {};

// Load user data from JSON file
try {
  user_data = JSON.parse(fs.readFileSync(user_data_file, 'utf8'));
} catch (err) {
  console.error('Error loading user data:', err);
}

app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(req.method + ' to ' + req.path);
  next();
});

// Registration route
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/registration.html");
});

// Registration form handling
app.post("/register", (req, res) => {
  const { username, password, repeat_password, email } = req.body;

  // Check if username or email already exists
  if (user_data[username] || user_data[email]) {
    return res.status(400).send("Username or email already exists.");
  }

  // Check if passwords match
  if (password !== repeat_password) {
    return res.status(400).send("Passwords do not match.");
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Save registration data
  user_data[username] = {
    email: email,
    password: hashedPassword
  };

  // Write user data to file
  fs.writeFile(user_data_file, JSON.stringify(user_data, null, 2), (err) => {
    if (err) {
      console.error('Error saving user data:', err);
      return res.status(500).send("Error saving user data.");
    }
    res.redirect("/login.html");
  });
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

  // Redirect to invoice page or wherever you want to go after successful login
  res.redirect("/invoice.html");
});

// Purchase form handling
app.post('/process_purchase_form', (req, res) => {
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
const PORT = 3000; // Retained the same port as the original code
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
