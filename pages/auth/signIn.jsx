import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
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
		if (status === "authenticated") router.replace("/");
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
				if (status.ok) router.replace("/");
				else setErrorMessage("Email and password do not match.");
			} else setErrorMessage(emailExists.msg);
		} else setErrorMessage("Email or password is missing.");
	};

	// If page is stil in loading or authenticated (already signed in)
	if (status === "loading" || status === "authenticated") return <h1>Loading...</h1>;

	return (
		<div className="flex justify-center mt-16 font-rale text-slate-900">
			<div className="flex-col text-center w-96">
				<div className="p-10 rounded-md bg-zinc-100 drop-shadow-lg">
					<h1 className="p-8 text-5xl font-extrabold text-green-700">Login</h1>
					<form className="font-bold font-rale font-lg" onSubmit={submitLogin}>
						<label className="label">Email Address</label>
						<input
							className="w-full p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-green-300"
							type="email"
							name="email"
							placeholder="Email Address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></input>

						<label className="mt-4 label">Password</label>
						<input
							className="w-full p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-green-300"
							type="password"
							name="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></input>
						<div className="mt-1 mb-2 font-sans text-sm font-medium text-left text-red-500">{message}</div>
						<button className="inline-block w-full px-4 py-2 mt-10 font-semibold text-white bg-green-700 rounded-xl hover:font-medium hover:bg-green-600">LOGIN</button>
						<div className="mt-8 mb-2 font-sans text-sm font-medium text-center">
							No account?{" "}
							<Link href="/register">
								<a className="underline decoration-dotted underline-offset-2 hover:text-green-700">Sign up here!</a>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
