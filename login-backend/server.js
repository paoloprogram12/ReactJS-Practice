// required packages
const express = require('express'); // web framework to create routes and handle requests
const mysql = require('mysql2'); // to connect to the SQL database
const cors = require('cors'); // allows requests from different origins (front end and react app)
const bodyParser = require('body-parser'); // parses incoming request bodies (JSON, etc.)
const bcrypt = require('bcryptjs'); // library to hash and compare passwords
require('dotenv').config(); // used for pass

// JSON: used to transmit data between a server and a web app
// CORS: browser security feature that controls access to resources on a web page from a diff origin

// create express
const app = express();

// define port number of the server
const port = 5000;

// cors fix
// app.use(cors({
//     origin: "http://localhost:3000", // allows requests from the react app
//     credentials: true // optional but useful for cookies/sessions
// }));

// // middleware setup
// // app.use(cors()); // enables CORS so frontend can communicate with server
// app.use(bodyParser.json()); // parses JSON data in request bodies

// CORRECTED CORS MIDDLEWARE SETUP
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
  
    // If it's a preflight request, send 200 immediately
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
  
    next(); // move to the next middleware/route
  });

// MySQL database setup
const db = mysql.createConnection({
    host: process.env.DB_HOST, // MySQL server is running locally
    user: process.env.DB_USER, // MySQL username
    password: process.env.DB_PASSWORD, // password
    database: process.env.DB_NAME // database for the project
});

// connect to SQL database
db.connect((err) => {
    if (err) {
        // if connection fails, log the error and stop
        console.error('Database connection failed: ', err);
        return;
    }
    // message if connection is successful
    console.log('Connected to mySQL');
});

// signup route
// handles registration of a new user
app.post('/signup', async (req, res) => {
    const { email, password } = req.body; // gets email and password from request body

    // checks if email is already used
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).send('Server Error'); // if there is a server/database error
        }
        if (results.length > 0) {
            return res.status(400).send('Email already registered') // email already used
        }

        // hashes the password
        const hashedPasswords = await bcrypt.hash(password, 10); // 10 = salt rounds

        // insert the new user into the database
        db.query(
            'INSERT INTO users (email, password) VALUES (?, ?)', // SQL query
            [email, hashedPasswords], // parameters for the query
            (err, results) => {
                if (err) {
                    return res.status(500).send('Error Creating User') // insert into DB failed
                }
                res.send('User registered successfully');
            }
        );
    });
});

// login route
// handles login for users that are already in the DB
app.post('/login', (req, res) => {
    const { email, password } = req.body; // gets the email and password from user from request (req)

    // looks for user in the db by email
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) { // if there is an error with the server
            return res.status(500).send('Server Error');
        }
        if (results.length === 0) { // if the email is not in the database
            return res.status(400).send('Email not found'); 
        }

        // retrieves the user from the db based on email result (query result)
        const user = results[0];

        // compares the password that the user entered with the hashed password in the db
        const match = await bcrypt.compare(password, user.password);
        if (!match) { // if the user-entered password doesn't match the hashed password in the db
            return res.status(401).send('Password is incorrect');
        }

        // if the user-entered password matches the hashed password in the database
        res.send('Login Successful');
    });
});

// starts the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});