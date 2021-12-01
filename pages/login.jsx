import { signIn } from "next-auth/client";
import { useState } from "react";

export default function login() {
    // Login credentials
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Login message (success or error)
    const [message, setMessage] = useState("");

    const submitLogin = async (event) => {
        event.preventDefault();

        // Check if credentials are complete
        if (email && password) {
            const status = await signIn("credentials", {
                email: email,
                password: password,
                callbackUrl: `${process.env.NEXT_PUBLIC_URL}`,
            });

            if (!status.error) setMessage("Login successful");
            else setMessage("Login unsuccessful! Please check your credentials.");
        } else {
            setMessage("Email or password is missing.");
        }
    };

    return (
        <>
            <h1>Login</h1>
            <div className="form-control">
                <form onSubmit={submitLogin}>
                    <label className="label">Email Address</label>
                    <input
                        className="input input-bordered"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>

                    <label className="label">Password</label>
                    <input
                        className="input input-bordered"
                        type="text"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    <button className="btn">Submit</button>
                </form>
            </div>
        </>
    );
}
