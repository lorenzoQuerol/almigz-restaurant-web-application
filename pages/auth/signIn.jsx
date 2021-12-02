import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function signInPage() {
    const router = useRouter();

    // Login credentials
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /*
        TODO - DESIGNERS: Up to you how to display the error message in the UI
    */
    const [message, setErrorMessage] = useState("");

    const submitLogin = async (event) => {
        event.preventDefault();

        // Check if credentials are complete
        if (email && password) {
            // Call signIn hook
            const status = await signIn("credentials", {
                redirect: false,
                email: email,
                password: password,
            });

            // Redirect to home page if sign in successful, set error message if not
            if (status.ok) router.push(process.env.NEXTAUTH_URL);
            else setErrorMessage("Email and password do not match.");
        } else {
            setErrorMessage("Email or password is missing.");
        }
    };

    return (
        <>
            {
                // Error message will only render if message is defined
                message && <h1>{message}</h1>
            }
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
