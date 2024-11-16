const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('frontend'));

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Apes2getherstrong!",
    database: "fansync"
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database successfully');
});

// Registration endpoint
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO members (Name, Email, Password) VALUES (?, ?, ?)";
    
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: "Registration failed" });
        }
        return res.status(201).json({ message: "User registered successfully" });
    });
});

// Add new login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Log the received data for debugging
    console.log('Login attempt:', { email, password });

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const sql = "SELECT * FROM members WHERE Email = ? AND Password = ?";
    
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Login failed" });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        
        // Login successful
        const user = results[0];
        return res.status(200).json({ 
            message: "Login successful",
            user: {
                id: user.MemberID,
                name: user.Name,
                email: user.Email
            }
        });
    });
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.listen(8081, () => {
    console.log("Server running on port 8081");
});