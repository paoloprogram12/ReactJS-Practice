import React, { useState } from "react"; // imports react and useState hook
import axios from "axios"; // import axios for HTTP requests

function Signup() {
    // State variables to store input values and response message
    const [email, setEmail] = useState(""); // stores the user email
    const [password, setPassword] = useState(""); // stores the user password
    const [msg, setMsg] = useState(""); // stores the feedback message (Success or Error)

    // function to handle form submissions
    const handleSignup = async (e) => {
        e.preventDefault(); // prevents the page from refreshing once submitted

        try {
            // Send POST request to backend/signup route
            const res = await axios.post("https://localhost:5000/signup", {
                email,
                password,
            });
        }
    }
}