## **Fansync Application**

This is a web application for user registration, login, and event check-in functionality. It includes features like ID verification (via Eden AI), session management, and role-based access (main representative vs. regular member).

## **Features**

* User signup with optional ID upload.  
* Login with session-based authentication.  
* Check-in functionality restricted to verified users.  
* Role-based restrictions: Non-main representatives cannot check in unless the main representative has checked in.

## **Prerequisites**

1. Node.js (v14 or higher)  
2. MySQL Database  
3. `npm` (Node Package Manager)

## **Installation**

## **1\. Clone the Repository**

bash  
`git clone <repository-url>`  
`cd housync-smart-sign-up-main`

## **2\. Install Dependencies**

Run the following command to install all required Node.js packages:  
bash  
`npm install`

## **3\. Start the Server**

Run the following command to start the server:  
bash  
`node server.js`

The server will run on `http://localhost:3000`.

## **Database Setup**

## **1\. Create MySQL User**

Run these SQL commands to create a MySQL user and grant privileges:  
sql  
`CREATE USER 'fansync'@'localhost' IDENTIFIED BY 'password';`  
`GRANT ALL PRIVILEGES ON *.* TO 'fansync'@'localhost';`  
`FLUSH PRIVILEGES;`

## **2\. Create Database**

Create a new database for the application:  
sql  
`CREATE DATABASE fansync;`  
`USE fansync;`

## **3\. Create Users Table**

Run the following SQL command to create the `users` table:  
sql  
`CREATE TABLE users (`  
    `id INT AUTO_INCREMENT PRIMARY KEY,`  
    `first_name VARCHAR(50) NOT NULL,`  
    `last_name VARCHAR(50) NOT NULL,`  
    `email VARCHAR(100) NOT NULL UNIQUE,`  
    `password VARCHAR(255) NOT NULL,`  
    `user_type ENUM('organizer', 'user') NOT NULL,`  
    `verified BOOLEAN DEFAULT false,`  
    `gov_id_number VARCHAR(100),`  
    `uploaded_image VARCHAR(255),`  
    `main_rep BOOLEAN DEFAULT false,`  
    `checked_in BOOLEAN DEFAULT false`  
`);`

## **4\. Insert Dummy Data**

Insert some dummy users into the table for testing:  
sql  
`INSERT INTO users (first_name, last_name, email, password, user_type, verified, gov_id_number, uploaded_image, main_rep, checked_in)`  
`VALUES`  
    `-- Verified Users`  
    `('Alice', 'Johnson', 'alice@example.com', 'Password123!', 'user', true, '123456789', NULL, true, false), -- Main Representative`  
    `('Bob', 'Smith', 'bob@example.com', 'Password123!', 'user', true, '987654321', NULL, false, false),`  
    `('Charlie', 'Brown', 'charlie@example.com', 'Password123!', 'user', true, '456789123', NULL, false, false),`

    `-- Unverified Users`  
    `('David', 'Williams', 'david@example.com', 'Password123!', 'user', false, NULL, NULL, false, false),`  
    `('Eve', 'Davis', 'eve@example.com', 'Password123!', 'user', false, NULL, NULL, false, false),`  
    `('Frank', 'Miller', 'frank@example.com', 'Password123!', 'user', false, NULL, NULL, false, false);`

## **Project Structure**

text  
`housync-smart-sign-up-main/`  
`├── public/`  
`│   ├── index.html          # Main landing page (login)`  
`│   ├── signup.html         # Signup page`  
`│   ├── checkin.html        # Check-in page`  
`│   ├── styles.css          # Stylesheet for pages`  
`│   └── scripts.js          # Frontend logic for signup and check-in`  
`├── server.js               # Main backend server file`  
`├── package.json            # Node.js dependencies and scripts`  
`└── README.md               # Project documentation (this file)`

## **How It Works**

## **Signup**

1. Users fill out their details on `signup.html`.  
2. If an ID is uploaded:  
   * The file is sent to Eden AI for verification.  
   * If recognized and verified successfully:  
     * The user is marked as verified in the database.  
   *   
   * Otherwise:  
     * The user is registered as unverified.  
   *   
3.   
4. User data is stored in the `users` table.

## **Login**

1. Users log in via `login.html`.  
2. On successful login:  
   * A session is created using `express-session`.  
   * The user is redirected to the check-in page (`checkin.html`).  
3. 

## **Check-In**

1. Verified users can check into events by clicking the "Check In" button on `checkin.html`.  
2. Non-verified users are denied access.  
3. Non-main representatives cannot check in unless the main representative has already checked in.

## **Endpoints**

## **`/signup` (POST)**

Registers a new user.

* Request Body:

json  
`{`  
    `"firstName": "John",`  
    `"lastName": "Doe",`  
    `"email": "john.doe@example.com",`  
    `"password": "Password123!",`  
    `"userType": "user",`  
    `"verified": true,`  
    `"govIdNumber": "123456789",`  
    `"uploadedImage": null,`  
    `"mainRep": true`  
`}`

Response:

* json

`{`  
    `"message": "User registered successfully"`  
`}`

*   
* 

## **`/login` (POST)**

Logs in a user.

* Request Body:

json  
`{`  
    `"email": "john.doe@example.com",`  
    `"password": "Password123!"`  
`}`

Response:

* json

`{`  
    `"message": "Login successful"`  
`}`

*   
* 

## **`/checkin` (POST)**

Allows a verified user to check into an event.

* Response:  
* json

`{`  
    `"message": "You have successfully checked in!"`  
`}`

*   
* 

## **Running Tests**

1. Open your browser and navigate to `http://localhost:3000/`.  
2. Test signup functionality by creating new users via `signup.html`.  
3. Test login functionality using dummy data (e.g., `alice@example.com`, password: `Password123!`).  
4. Test check-in functionality by logging in as a verified user.

## **Troubleshooting**

1. **Database Connection Issues**:  
   * Ensure MySQL is running and credentials are correct.  
   * Use `mysql -u fansync -p` to test database access.  
2.   
3. **Session Issues**:  
   * Ensure cookies are enabled in your browser.  
   * Check if the session middleware is properly configured.  
4.   
5. **Eden AI Integration**:  
   * Verify that Eden AI API keys are valid.  
   * Check logs for errors during file uploads or status polling.  
6. 

This README provides all necessary steps to set up and run your Fansync application successfully\! This Markdown file will render correctly on GitHub with proper formatting for headings (`#`), code blocks (triple backticks), and lists (`-`, `1.`).  
