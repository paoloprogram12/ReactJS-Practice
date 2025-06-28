import React, { useState } from "react"; // imports react and useState hook
import axios from "axios"; // import axios for HTTP requests
import { useNavigate } from "react-router-dom"; // allows navigation

function Signup() {
    // State variables to store input values and response message
    const [email, setEmail] = useState(""); // stores the user email
    const [password, setPassword] = useState(""); // stores the user password
    const [msg, setMsg] = useState(""); // stores the feedback message (Success or Error)
    const navigate = useNavigate(); // allows changing pages

    // function to handle form submissions
    const handleSignup = async (e) => {
        e.preventDefault(); // prevents the page from refreshing once submitted

        try {
            // Send POST request to backend/signup route
            const res = await axios.post("http://localhost:5000/signup", {
                email,
                password,
            });

            setMsg(res.data); // displays the backend response (ex: User registered successfully)

            // redirect to login after a short delay
            setTimeout(() => {
                navigate("/login"); // navigates back to the login page
            }, 1000); // delays by 1 second
        } catch (err) {
            // handles any error from the backend
            setMsg(err.response?.data || "Signup failed");
        }
    };

    return (
        <div>
            <h2>Signup</h2>

            {/* Signup Form */}
            <form onSubmit={handleSignup}>
                {/* Email input */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email} // bind input to state
                    onChange={(e) => setEmail(e.target.value)} // update email state on change
                /><br/>

                {/* Password Input*/}
                <input
                    type="password"
                    placeholder="Password"
                    value={password} // bind input to state
                    onChange={(e) => setPassword(e.target.value)} // update password state on change
                /><br/>

                <button type="submit">Register</button> {/* Submit button */}
            </form>

            <p>{msg}</p> {/* Show response message */}
        </div>
    );
}

export default Signup; // export the signup component

// fix the sign up front end portion, doesn't work