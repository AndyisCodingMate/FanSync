const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
  secret: 'your_secret_key', // Change this to a secure secret key
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // Session expiration time (1 minute in this case)
}));

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

// Serve static files (CSS, JS)
app.use(express.static('public'));

// Routes

// GET Sign-Up Page
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

// POST Sign-Up Form
app.post('/signup', async (req, res) => {
  const { userID, name, email, password } = req.body;

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into the database with email and hashed password
  const query = `
    INSERT INTO Users (userID, name, email, password, verified, documents, govID_number, ticketID_list) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [userID, name, email, hashedPassword, 0, '', '', ''], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Server error');
    }
    console.log('User registered successfully!');
    res.redirect('/login'); // Redirect to login page after successful sign-up
  });
});

// GET Login Page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// POST Login Form
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database using their email
  const query = 'SELECT * FROM Users WHERE email = ?';
  
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = results[0];

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Incorrect password');
    }

    // Store user information in session upon successful login
    req.session.userID = user.userID;
    req.session.loggedIn = true;

    res.redirect('/');
  });
});

// GET Main Page (Home)
app.get('/', (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login'); // Redirect to login page if not logged in
  }

  res.send(`
    <h1>Welcome ${req.session.userID}!</h1>
    <a href="/logout">Logout</a>
  `);
});

// GET Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    
    res.redirect('/login'); // Redirect to login page after logout
  });
});

// Start server on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
