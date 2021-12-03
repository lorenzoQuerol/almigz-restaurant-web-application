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
        <div class="w-1/2 flex-col text-center">
            <h1 class="text-5xl font-rale text-black font-bold p-8">Login</h1>
            <div class="rounded-md shadow-xl border-t border-t-gray-100 p-10">
                <form class="font-rale font-lg text-gray-800 font-bold" onSubmit={submitLogin}>
                    <label class="label">Email Address</label>
                    <input
                        class="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>

                    <label class="label mt-4">Password</label>
                    <input
                        class="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type="text"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    <button class="font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
