// required packages
require('dotenv').config(); // used for pass
const express = require('express'); // web framework to create routes and handle requests
const mysql = require('mysql2'); // to connect to the SQL database
const cors = require('cors'); // allows requests from different origins (front end and react app)
const bodyParser = require('body-parser'); // parses incoming request bodies (JSON, etc.)
const bcrypt = require('bcryptjs'); // library to hash and compare passwords
const nodemailer = require('nodemailer'); // allows email confirmation
// const { default: Signup } = require('../login-frontend/src/Signup');


// JSON: used to transmit data between a server and a web app
// CORS: browser security feature that controls access to resources on a web page from a diff origin

// create express
const app = express();

// define port number of the server
const port = process.env.PORT || 5001;

app.use(cors({
    origin: 'http://localhost:3000',    // EXACTLY your React URL
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
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

// mailtrap transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// signup route
// handles registration of a new user
app.post('/signup', async (req, res) => {
    console.log('BODY:', req.body);
    const { email, password } = req.body; // gets email and password from request body

    // checks if email is already used
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).send('Server Error'); // if there is a server/database error
        }
        if (results.length > 0) {
            return res.status(400).send('Email already registered'); // email already used
        }

        // hashes the password
        const hashedPasswords = await bcrypt.hash(password, 10); // 10 = salt rounds

        //generates the 6 digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // insert the new user into the database
        db.query(
            'INSERT INTO users (email, password, verification_code) VALUES (?, ?, ?)', // SQL query
            [email, hashedPasswords, code], // parameters for the query
            async (err) => {
                if (err) {
                    return res.status(500).send('Error Creating User'); // insert into DB failed
                }

                // used to send email verification
                try {
                    let info = await transporter.sendMail({
                        from: process.env.EMAIL_FROM,
                        to: email,
                        subject: 'Your Verification Code',
                        text: `Welcome! Your Verification Code is: ${code}`
                    });

                    // logs the preview URL
                    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

                    // tells the frontend to proceed with the verification
                    res.send('Signup successful, check your email for a verification code');
                } catch (mailErr) {
                    console.error('Error sending Email', mailErr);
                    return res
                            .status(500)
                            .send('Signup succeeded, but failed to send verification email');
                }
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

// user verification
app.post('/verify', (req, res) => {
    const { email, code } = req.body;

    // finds the matching user and code
    db.query(
        'SELECT * FROM users WHERE email = ? AND verification_code = ?',
        [email, code],
        (err, results) => {
            if (err) { return res.status(500).send('Server Error'); }
            if (!results.length) { return res.status(400).send('Invalid Code'); }

            db.query(
                'UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE email = ?',
                [email],
                (err) => {
                    if (err) { return res.status(500).send('Error Verifying User'); }
                    res.send('Email verified, your account is now active');
                }
            );
        }
    );
});

// resend verification code
app.post('/resend-code', async (req, res) => {
    const { email } = req.body;

    db.query('SELECT is_verified FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) { return res.status(500).send('Server Error'); }
        if (!results.length) { return res.status(400).send('Email not Found'); }
        if (results[0].is_verified) { return res.status(400).send('Account is already registered'); }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        db.query(
            'UPDATE users SET verification_code = ? WHERE email = ?',
            [newCode, email],
            async (err) => {
                if (err) { return res.status(500).send('Error Generating new Code'); }

                try {
                    let info = await transporter.sendMail({
                        from: process.env.EMAIL_FROM,
                        to: email,
                        subject: 'Your New Verification Code',
                        text: `Here's your new verification code: ${newCode}`
                    });
                    console.log('Preview URL', nodemailer.getTestMessageUrl(info));
                    res.send('A new verification code has been sent to your email');
                } catch (err) {
                    console.error('Error sending new code', mailErr);
                    res.status(500).send('Could not send verification code');
                }
            }
        );
    });
});

// starts the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});