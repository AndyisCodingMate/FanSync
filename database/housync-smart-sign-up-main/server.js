const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto'); // Import crypto module for generating the secret key

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, '../housync-smart-sign-up-main/public')));

// Generate a secure secret key for session
const sessionSecret = crypto.randomBytes(32).toString('hex'); // Generate a 64-character hex string
console.log(`Generated Session Secret: ${sessionSecret}`); // Log the secret key (for debugging purposes)

// Configure session middleware
app.use(session({
    secret: sessionSecret, // Use the generated secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'fansync', // MySQL user
    password: 'password', // MySQL password
    database: 'fansync'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Default route: Serve the Login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../housync-smart-sign-up-main/public/login.html'));
});

// Signup route
app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password, userType, verified, govIdNumber, uploadedImage, mainRep } = req.body;

    const query = `
        INSERT INTO users (first_name, last_name, email, password, user_type, verified, gov_id_number, uploaded_image, main_rep, checked_in)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query,
        [firstName, lastName, email.toLowerCase(), password, userType.toLowerCase(), verified || false, govIdNumber || null, uploadedImage || null, mainRep || false, false],
        (err) => {
            if (err) {
                console.error('Database error:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send({ message: 'Email already exists' });
                }

                return res.status(500).send({ message: 'Database error' });
            }

            res.status(201).json({ message: 'User registered successfully' });
        }
    );
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(`Database error for login attempt with email ${email}:`, err);
            return res.status(500).send({ message: 'Database error' });
        }

        if (results.length === 0) {
            console.log(`User not found for email: ${email}`);
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        console.log(`User found for login attempt:`, user);

        // Compare passwords directly (since hashing was removed)
        if (password === user.password) { 
            console.log(`Successful login for user with email ${email}`);

            // Store user info in session
            req.session.user = { id: user.id, email: user.email, verified: !!user.verified };
            console.log('Session data set:', req.session.user);

            res.status(200).json({ message: 'Login successful' });
        } else {
            console.log(`Invalid password for user with email ${email}`);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

// Check-in route
app.post('/checkin', (req, res) => {
    // Ensure the user is logged in
    if (!req.session.user) {
        console.error('No user session found');
        return res.status(401).json({ message: "You must be logged in to check in." });
    }

    const { id, verified } = req.session.user;

    // Ensure the user is verified
    if (!verified) {
        return res.status(403).json({ message: "You must be verified to check in." });
    }

    // Mark the user as checked in
    db.query(`UPDATE users SET checked_in = true WHERE id = ?`, [id], (err) => {
        if (err) {
            console.error("Error checking in:", err);
            return res.status(500).json({ message: "Error checking in." });
        }

        res.json({ message: "You have successfully checked in!" });
    });
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
