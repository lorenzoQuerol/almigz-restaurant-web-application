import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import toTitleCase from "@utils/toTitleCase";

export default function Register() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const sameContact = () => {
		return watch("contact1") !== watch("contact2");
	};

	// Session
	const { data: session, status } = useSession();

	// Error message
	const [message, setMessage] = useState("");

	// Redirect if already logged in
	useEffect(() => {
		if (status === "authenticated") router.replace("/");
	}, [session, status]);

	const submitRegister = async (data) => {
		if (data.password === data.confirmPassword) {
			data.firstName = toTitleCase(data.firstName);
			data.lastName = toTitleCase(data.lastName);
			data.contact1 = `+63${data.contact1}`;
			if (data.contact2) data.contact2 = `+63${data.contact2}`;

			const response = await axios.post("/api/users", data);

			if (response.data.success) {
				await signIn("credentials", {
					email: data.email,
					password: data.password,
					callbackUrl: process.env.NEXTAUTH_URL,
				});
			} else {
				setMessage(response.data.message);
			}
		} else {
			setMessage("Ensure both passwords are the same");
		}
	};

	// If page is stil in loading or authenticated (already signed in)
	if (status === "loading" || status === "authenticated") return <h1>Loading...</h1>;

	return (
		<div className="flex justify-center text-gray-800 font-rale">
			<div className="flex-col w-full mx-6 my-16 text-center rounded shadow sm:w-1/3 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-zinc-100">
				<div className="p-5">
					<h1 className="py-5 text-2xl font-extrabold text-green-700 sm:text-4xl">Create an Account</h1>
					<form className="text-sm font-medium font-rale" onSubmit={handleSubmit(submitRegister)}>
						{/* First name */}
						<label className="label">First Name</label>
						<input
							className="w-full p-5 rounded input input-sm input-bordered focus:ring-2 focus:ring-green-700"
							type="text"
							placeholder="First Name"
							{...register("firstName", { required: true, maxLength: 80 })}
						/>
						{errors.firstName?.type === "required" && <div className="mt-1 text-xs font-medium text-left text-red-500">First name is required</div>}
						{errors.firstName?.type === "maxLength" && (
							<div className="mt-1 text-xs font-medium text-left text-red-500">First name should be less than 80 characters</div>
						)}

						{/* Last name */}
						<label className="mt-4 label">Last Name</label>
						<input
							className="w-full p-5 rounded input input-sm input-bordered focus:ring-2 focus:ring-green-700"
							type="text"
							placeholder="Last Name"
							{...register("lastName", { required: true, maxLength: 100 })}
						/>
						{errors.lastName?.type === "required" && <div className="mt-1 text-xs font-medium text-left text-red-500">Last name is required</div>}
						{errors.lastName?.type === "required" && (
							<div className="mt-1 text-xs font-medium text-left text-red-500">Last name should be less than 100 characters</div>
						)}

						{/* Email address */}
						<label className="mt-4 label">Email Address</label>
						<input
							className="w-full p-5 rounded input input-sm input-bordered focus:ring-2 focus:ring-green-700"
							type="text"
							title="Please input a proper email address"
							placeholder="example@email.com"
							{...register("email", { required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ })}
						/>
						{errors.email?.type === "required" && <div className="mt-1 text-xs font-medium text-left text-red-500">Email address is required</div>}
						{errors.email?.type === "pattern" && <div className="mt-1 text-xs font-medium text-left text-red-500">Please provide a valid email address</div>}

						{/* Password */}
						<label className="mt-4 label">Password</label>
						<input
							className="w-full p-5 rounded input input-sm input-bordered focus:ring-2 focus:ring-green-700"
							type="password"
							title="Password should have at least 8 characters and should not contain whitespace."
							placeholder="Password"
							{...register("password", { required: true, minLength: 8, pattern: /^\S+$/i })}
						/>
						{errors.password?.type === "required" && <div className="mt-1 text-xs font-medium text-left text-red-500">Password is required</div>}
						{errors.password?.type === "minLength" && <div className="mt-1 text-xs font-medium text-left text-red-500">Password should have at least 8 characters</div>}
						{errors.password?.type === "pattern" && <div className="mt-1 text-xs font-medium text-left text-red-500">Password should not contain whitespaces</div>}

						{/* Confirm password */}
						<label className="mt-4 label">Confirm Password</label>
						<input
							className="w-full p-5 rounded input input-sm input-bordered focus:ring-2 focus:ring-green-700"
							type="password"
							placeholder="Confirm Password"
							{...register("confirmPassword", { required: true })}
						/>
						{errors.confirmPassword?.type === "required" && <div className="mt-1 text-xs font-medium text-left text-red-500">Please confirm your password</div>}

						{/* Home address */}
						<label className="mt-4 label">Home Address</label>
						<textarea
							className="w-full h-20 p-5 rounded input input-sm input-bordered focus:ring-2 focus:ring-green-700"
							type="text"
							placeholder="Home Address"
							{...register("address", { required: true, maxLength: 100 })}
						/>
						{errors.address?.type === "required" && <div className="mt-1 text-xs font-medium text-left text-red-500">Home address is required</div>}
						{errors.address?.type === "maxLength" && (
							<div className="mt-1 text-xs font-medium text-left text-red-500">Home address should be less than 100 characters</div>
						)}

						{/* Contact number 1 */}
						<label className="mt-4 label">Contact Number 1</label>
						<div className="flex items-center w-full pl-2 font-sans font-medium text-gray-600 rounded align-left">
							+63
							<input
								className="w-full p-5 pl-3 ml-2 font-sans tracking-wide rounded input input-sm input-bordered focus:ring-2 focus:ring-green-700"
								type="tel"
								placeholder="9XXXXXXXXX (Mobile Number)"
								{...register("contact1", { required: true, minLength: 10, maxLength: 10, pattern: /^9[0-9]+$/ })}
							/>
						</div>
						{errors.contact1?.type === "required" && <div className="mt-1 text-xs font-medium text-left text-red-500">Contact number is required</div>}
						{errors.contact1?.type === "maxLength" && <div className="mt-1 text-xs font-medium text-left text-red-500">Contact number must be 10 digits</div>}
						{errors.contact1?.type === "minLength" && <div className="mt-1 text-xs font-medium text-left text-red-500">Contact number must be 10 digits</div>}
						{errors.contact1?.type === "pattern" && (
							<div className="mt-1 text-xs font-medium text-left text-red-500">Contact number must start with 9 and no characters</div>
						)}

						{/* Contact number 2 */}
						<label className="mt-4 label">Contact Number 2 (Optional)</label>
						<div className="flex items-center w-full pl-2 font-sans font-medium text-gray-600 rounded align-left">
							+63
							<input
								className="w-full p-5 pl-3 ml-2 font-sans tracking-wide rounded input input-sm input-bordered focus:ring-2 focus:ring-green-700"
								type="tel"
								placeholder="9XXXXXXXXX (Mobile Number)"
								{...register("contact2", { required: false, minLength: 10, maxLength: 10, pattern: /^9[0-9]+$/, validate: sameContact })}
							/>
						</div>
						{errors.contact2?.type === "maxLength" && <div className="mt-1 text-xs font-medium text-left text-red-500">Contact number must be 10 digits</div>}
						{errors.contact2?.type === "minLength" && <div className="mt-1 text-xs font-medium text-left text-red-500">Contact number must be 10 digits</div>}
						{errors.contact2?.type === "pattern" && (
							<div className="mt-1 text-xs font-medium text-left text-red-500">Contact number must start with 9 and no characters</div>
						)}
						{errors.contact2?.type === "validate" && (
							<div className="mt-1 text-xs font-medium text-left text-red-500">Contact number 2 must not be the same as contact number 1</div>
						)}

						{/* Confirm password error */}
						{message && <div className="mt-4 text-xs font-medium text-left text-red-500">{message}</div>}
						<br />

						{/* Submit button */}
						<button className="inline-block w-full px-4 py-2 font-medium text-white transition-colors bg-green-700 rounded hover:bg-green-600">Register</button>
						<div className="mt-8 mb-2 text-sm font-semibold text-center">
							Already have an account?{" "}
							<Link href="/signin">
								<a className="underline decoration-dotted underline-offset-2 hover:text-green-700">Login here!</a>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

Register.layout = "consumer";
