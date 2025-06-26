// required packages
const express = require('express'); // web framework to create routes and handle requests
const mysql = require('myspl2'); // to connect to the SQL database
const cors = require('cors'); // allows requests from different origins (front end and react app)
const bodyParser = require('body-parser'); // parses incoming request bodies (JSON, etc.)
const bcrypt = require('bcryptjs'); // library to hash and compare passwords