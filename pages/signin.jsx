import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import checkEmail from "@utils/checkEmail";

export default function Signin() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	// Session
	const { data: session, status } = useSession();

	// Error message
	const [message, setErrorMessage] = useState("");

	// Redirect if already logged in
	useEffect(() => {
		if (session) {
			if (session.user.isAdmin) router.replace("/admin");
		}
	}, [session]);

	const submitLogin = async (data) => {
		const emailExists = await checkEmail(data.email);

		if (emailExists.success) {
			const status = await signIn("credentials", {
				redirect: false,
				email: data.email,
				password: data.password,
			});

			if (status.ok) router.replace("/");
			else setErrorMessage("Email and password do not match");
		} else {
			setErrorMessage(emailExists.message);
		}
	};

	if (status === "loading" || status === "authenticated") return <h1>Loading...</h1>;

	return (
		<div className="flex justify-center mt-16 font-rale text-gray-800">
			<div className="flex-col text-center w-96">
				<div className="p-10 rounded bg-zinc-100 shadow">
					<h1 className="p-8 text-5xl font-extrabold text-green-700">Login</h1>
					<form className="font-bold font-rale font-lg" onSubmit={handleSubmit(submitLogin)}>
						{/* Email address */}
						<label className="label">Email Address</label>
						<input
							className="w-full p-5 rounded input input-sm input-bordered focus:ring-2 focus:ring-green-300"
							type="text"
							title="Email Address"
							placeholder="Email Address"
							{...register("email", { required: true, pattern: /^\S+@\S+$/i })}
						/>
						{errors.email && <div className="mt-1 text-sm font-medium text-left text-red-500">Email address is required</div>}

						{/* Password */}
						<label className="mt-4 label">Password</label>
						<input
							className="w-full p-5 rounded input input-sm input-bordered focus:ring-2 focus:ring-green-300"
							type="password"
							title="Password"
							placeholder="Password"
							{...register("password", { required: true })}
						/>
						{errors.password && <div className="mt-1 text-sm font-medium text-left text-red-500">Password is required</div>}

						{/* Error message */}
						<div className="mt-1 mb-2 font-sans text-sm font-medium text-left text-red-500">{message}</div>

						{/* Submit button */}
						<button className="inline-block w-full px-4 py-2 mt-10 transition-colors font-medium text-white bg-green-700 rounded hover:font-medium hover:bg-green-600">
							Login
						</button>
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

Signin.layout = "consumer";
