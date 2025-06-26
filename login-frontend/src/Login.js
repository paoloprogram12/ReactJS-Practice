import React, { useState } from "react"; // import react and useState hook
import axios from "axios"; // import axios for http requests

function Login() {
    // variables to store user inputs and feedback messages
    const [email, setEmail] = useState(""); // email input state
    const [password, setPassword] = useState(""); // password input state
    const [msg, setMsg] = useState(""); // message input state

    // function to handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // prevent the form from refreshing the page

        try {
            // send POST request to /login endpoint
            const res = await axios.post("https://localhost:5000/login", {
                email,
                password,
            });

            setMsg(res.data); // set success message from backend
        } catch (err) {
            // set error message if the login fails
            setMsg(err.response?.data || "Login Failed");
        }
    };

    
}