import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession, signIn, signOut } from "next-auth/react";

import Cart from "@components/Cart";

const Navbar = () => {
	const { data: session, status } = useSession();
	const [open, setOpen] = useState(false);

	const logOut = () => {
		signOut({ callbackUrl: "http://localhost:3000/" });
		localStorage.clear();
	};

	if (session) {
		return (
			<>
				<nav className="w-full h-24 mb-2 border-t-8 border-green-800 shadow-lg navbar text-neutral-content rounded-box">
					<div className="flex items-center">
						<div className="self-center text-base lg:flex ">
							<Link href="/">
								<div className="m-4">
									<Image src="/logo.png" alt="store-logo" width={200} height={50} />
								</div>
							</Link>
							<Link href="/">
								<a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">HOME</a>
							</Link>

							<Link href="/menu">
								<a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">MENU</a>
							</Link>

							<Link href="/about">
								<a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">ABOUT US</a>
							</Link>
						</div>
					</div>
					<div className="flex items-center justify-end flex-1 m-3">
						<a onClick={(e) => setOpen(!open)}>
							<div className="m-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									alt="View Cart"
									className="w-8 h-8 p-0 bg-white rounded hover:bg-green-100"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
								</svg>
								<Cart open={open} setOpen={setOpen} />
								{/* <Image src="/cart.png" className="bg-white rounded hover:bg-green-100" alt="Add to Cart" width={35} height={35} /> */}
							</div>
						</a>

						<div className="dropdown">
							<div tabIndex="0" className="m-1 font-normal bg-white rounded btn ">
								Hi, {session.user.name}!
								<svg className="w-4 h-4 ml-2" viewBox="0 -6 524 524" xmlns="http://www.w3.org/2000/svg">
									<title>Account Options</title>
									<path d="M64 191L98 157 262 320 426 157 460 191 262 387 64 191Z" />
								</svg>
							</div>
							<ul className="p-2 divide-y rounded shadow menu dropdown-content bg-base-100 w-44">
								<li>
									<a href="/account">My Account</a>
								</li>
								<li>
									<a href="#" onClick={(e) => logOut()}>
										Sign Out
									</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</>
		);
	} else {
		return (
			<>
				<nav className="w-full h-24 mb-2 border-t-8 border-green-800 shadow-lg navbar text-neutral-content rounded-box">
					<div className="flex items-center">
						<div className="self-center text-base lg:flex ">
							<Link href="/">
								<a className="m-4">
									<Image src="/logo.png" alt="store-logo" width={200} height={50} />
								</a>
							</Link>
							<Link href="/">
								<a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">HOME</a>
							</Link>

							<Link href="/menu">
								<a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">MENU</a>
							</Link>
							<Link href="/about">
								<a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">ABOUT US</a>
							</Link>
						</div>
					</div>
					<div className="flex items-stretch justify-end flex-1 mr-3">
						<div className="flex divide-x divide-gray-400">
							<Link href="/auth/signIn">
								<a className="self-center p-2 font-normal rounded-btn hover:font-medium hover:text-green-700">Login</a>
							</Link>
							<Link href="/register">
								<a className="self-center p-2 font-normal rounded-btn hover:font-medium hover:text-green-700">Sign Up</a>
							</Link>
						</div>
					</div>
				</nav>
			</>
		);
	}
};

export default Navbar;
