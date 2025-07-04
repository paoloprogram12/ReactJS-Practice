import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function Verify() {
    const navigate = useNavigate();
    const state = useLocation(); // reads the email that is passed from signup
    const [code, setCode] = useState(""); // stores the users input code
    const [msg, setMsg] = useState(""); // feedback msg

    const handleVerify = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/verify", {
                email: state.email,
                code
            });
            setMsg(res.data);
            setTimeout(() => navigate("/login"), 1000); // redirects back to login if successful
        } catch (err) {
            setMsg(err.response?.data || "Verification Failed");
        }
    };
}