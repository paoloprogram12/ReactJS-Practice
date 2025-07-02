import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("token"); // allows you to sign out

        navigate("/login");
    };

    return (
        <div>
            <h2>Sup</h2>
            <p>This is your home now...</p>

        { /* Sign Out Button */ }
        <button onClick={handleSignOut}>
            Sign Out
        </button>
        </div>
    )
}