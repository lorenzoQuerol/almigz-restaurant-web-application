import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import * as firebaseui from "firebaseui";
import firebase from "@utils/firebase/firebaseClient";
import Link from "next/link";

const uiConfig = {
	// Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
	signInSuccessUrl: "/",
	// Email and password auth provider
	signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
};

export default function signin() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	// API response message
	const [message, setMessage] = useState("");

	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			// Send session to /api/auth route to set the auth cookie.
			// NOTE: this is only needed if you're doing SSR (getServerSideProps)!
			fetch("/api/auth", {
				method: "POST",
				headers: new Headers({ "Content-Type": "application/json" }),
				credentials: "same-origin",
				body: JSON.stringify({ event, session }),
			}).then((res) => res.json());
		});

		return () => {
			authListener.unsubscribe();
		};
	}, []);

	const submitLogin = async (data) => {
		const { user, session, error } = await supabase.auth.signIn({
			email: data.email,
			password: data.password,
		});

		if (error) setMessage(error.message);
		else router.replace("/");
	};

	return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;
	return (
		<div className="flex justify-center mt-16 font-rale text-slate-900">
			<div className="flex-col text-center w-96">
				<div className="p-10 rounded-md bg-zinc-100 drop-shadow-lg">
					<h1 className="p-8 text-5xl font-extrabold text-green-700">Login</h1>
					<form className="font-bold font-rale font-lg" onSubmit={handleSubmit(submitLogin)}>
						{/* Email address */}
						<label className="label">Email Address</label>
						<input
							className="w-full p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-green-300"
							type="text"
							title="Email Address"
							placeholder="Email Address"
							{...register("email", { required: true, pattern: /^\S+@\S+$/i })}
						/>
						{errors.email && <div className="text-sm font-medium text-left text-red-500">Email address is required</div>}

						{/* Password */}
						<label className="mt-4 label">Password</label>
						<input
							className="w-full p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-green-300"
							type="text"
							title="Password"
							placeholder="Password"
							{...register("password", { required: true })}
						/>
						{errors.password && <div className="text-sm font-medium text-left text-red-500">Password is required</div>}

						{/* Error message */}
						<div className="mt-1 mb-2 font-sans text-sm font-medium text-left text-red-500">{message}</div>

						{/* Submit button */}
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
