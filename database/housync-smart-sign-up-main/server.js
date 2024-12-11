const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, '../housync-smart-sign-up-main/public')));

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
app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, userType, verified, govIdNumber, uploadedImage } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (first_name, last_name, email, password, user_type, verified, gov_id_number, uploaded_image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.query(query,
            [firstName, lastName, email.toLowerCase(), hashedPassword, userType.toLowerCase(), verified || false, govIdNumber || null, uploadedImage || null],
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
    } catch (error) {
        console.error('Error in /signup route:', error);
        res.status(500).send({ message: 'Error registering user' });
    }
});



// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ?`;

    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

// Start the server on port 5000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
