import React, { useState, useEffect } from "react";

export default function Login() {
    const [showModal, setShowModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    const API_URL = "http://localhost:3000/api/auth";

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    async function handleSubmit() {
        try {
            const url = isLogin ? "/login" : "/register";

            const body = isLogin
                ? { email, password }
                : { email, password, displayName };

            const res = await fetch(`${API_URL}${url}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            console.log("RESPONSE:", data);

            if (!res.ok) {
                alert(data.error || data.message || "Something went wrong");
                return;
            }

            if (isLogin) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userRole", data.user.role);
                setIsLoggedIn(true);
                alert("Login successful!");
            } else {
                alert("Account created! You can now log in.");
                setIsLogin(true);
            }

            setShowModal(false);

            setEmail("");
            setPassword("");
            setDisplayName("");

        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setIsLoggedIn(false);
        alert("Logged out");
    }

    return (
        <>
            {/* 🔘 MAIN BUTTON (NOW TOGGLES LOGIN OR LOGOUT) */}
            <button
                className="right-button"
                onClick={() => {
                    if (isLoggedIn) {
                        handleLogout();
                    } else {
                        setShowModal(true);
                    }
                }}
            >
                {isLoggedIn ? "Logout" : "Login / Sign up"}
            </button>

            {/* 🪟 MODAL */}
            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="login-title">
                            {isLogin ? "Login" : "Create Account"}
                        </h2>

                        <div className="form-row">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {!isLogin && (
                                <input
                                    type="text"
                                    placeholder="Display Name"
                                    value={displayName}
                                    onChange={(e) =>
                                        setDisplayName(e.target.value)
                                    }
                                />
                            )}

                            <button onClick={handleSubmit}>
                                {isLogin ? "Log in" : "Sign up"}
                            </button>

                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                style={{
                                    background: "transparent",
                                    color: "#4a90e2",
                                    border: "none"
                                }}
                            >
                                {isLogin
                                    ? "Need an account?"
                                    : "Already have an account?"}
                            </button>
                            {import.meta.env.DEV && (
                                <button
                                    onClick={() => {
                                        setEmail("dev@casttrack.local");
                                        setPassword("devpassword123");
                                        setIsLogin(true);
                                    }}
                                    style={{ background: "transparent", color: "#aaa", border: "1px dashed #aaa", fontSize: "0.8rem" }}
                                >
                                    Fill Dev Credentials
                                </button>
                            )}
       
                            <button onClick={() => setShowModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}