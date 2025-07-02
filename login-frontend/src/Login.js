import React, { useState } from "react"; // import react and useState hook
import axios from "axios"; // import axios for http requests
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // allows navigation

function Login() {
    // variables to store user inputs and feedback messages
    const [email, setEmail] = useState(""); // email input state
    const [password, setPassword] = useState(""); // password input state
    const [msg, setMsg] = useState(""); // message input state
    const navigate = useNavigate(); // allows changing pages

    // function to handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // prevent the form from refreshing the page

        try {
            // send POST request to /login endpoint
            const res = await axios.post("https://localhost:5001/login", {
                email,
                password,
            });

            setMsg(res.data); // set success message from backend

            // redirect to login after a short delay
            setTimeout(() => {
                navigate("/home"); // takes you to home after button press
            }, 1000); // 1 sec delay
        } catch (err) {
            // set error message if the login fails
            setMsg(err.response?.data || "Login Failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>

            {/* Login form */}
            <form onSubmit={handleLogin}>
                {/* Email input */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email} // the input value
                    onChange={(e) => setEmail(e.target.value)} // updates the email state
                /><br/>

                {/* Password input */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password} // the input value
                    onChange={(e) => setPassword(e.target.value)} // updates the password state
                /><br/>

                <button type="submit">Login</button> {/* Submits the form */}
            </form>

            <p>{msg}</p> {/* Displays the message that is listed in the backend */}

            { /* Link to signup page */ }
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
                { /* Clicking this takes user to /signup without reloading the page */ }
            </p>
        </div>
    );
}

export default Login; // exports the login component