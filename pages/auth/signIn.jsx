import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import checkEmail from "@utils/checkEmail";

export default function signInPage() {
	const router = useRouter();

	// Get session
	const { data: session, status } = useSession();

	// Login credentials
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// For API error messages
	const [message, setErrorMessage] = useState("");

	useEffect(() => {
		if (status === "authenticated") router.push("/");
	}, [status]);

	const submitLogin = async (event) => {
		event.preventDefault();

		// Check if credentials are complete
		if (email && password) {
			// Check if email exists in the system
			const emailExists = await checkEmail(email);

			if (emailExists.success) {
				// Call signIn hook
				const status = await signIn("credentials", {
					redirect: false,
					email: email,
					password: password,
				});

				// SUCCESS: Redirect to home page if sign in successful
				if (status.ok) router.push("/");
				else setErrorMessage("Email and password do not match.");
			} else setErrorMessage(emailExists.msg);
		} else setErrorMessage("Email or password is missing.");
	};

	// If page is stil in loading or authenticated (already signed in)
	if (status === "loading" || status === "authenticated") return <h1>Loading...</h1>;

	return (
		<div className="flex-col w-1/2 text-center">
			<h1 className="p-8 text-5xl font-bold text-black font-rale">Login</h1>
			<div className="p-10 border-t rounded-md shadow-xl border-t-gray-100">
				<form className="font-bold text-gray-800 font-rale font-lg" onSubmit={submitLogin}>
					<label className="label">Email Address</label>
					<input
						className="w-full p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-blue-300"
						type="email"
						name="email"
						placeholder="Email Address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></input>

					<label className="mt-4 label">Password</label>
					<input
						className="w-full p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-blue-300"
						type="password"
						name="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></input>
					<div className="mt-4 font-sans font-normal text-left text-red-500">{message}</div>
					<button className="p-4 m-5 font-normal text-white bg-green-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-green-300">Submit</button>
				</form>
			</div>
		</div>
	);
}
