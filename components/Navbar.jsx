import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession, signIn, signOut } from "next-auth/react";

import Cart from "@components/Cart";
import MobileNavbar from "@components/MobileNavbar";

const Navbar = () => {
	const { data: session, status } = useSession();
	const [open, setOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const router = useRouter();

	const logOut = () => {
		signOut({ callbackUrl: "http://localhost:3000/" });
		localStorage.clear();
	};

	const navigationBar = [
		{ id: "1", href: "/", name: "HOME", current: true },
		{ id: "2", href: "/menu", name: "MENU", current: false },
		{ id: "3", href: "/about", name: "ABOUT US", current: false },
	];

	const handleOpen = () => {
		setOpen(!open);
	};

	return (
		<header className="border-t-8 border-green-800 shadow-xl text-slate-900 body-font">
			<div className="container relative flex flex-col flex-wrap px-5 py-5 mx-auto md:flex-row">
				<MobileNavbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
				{/* Mobile menu button */}
				<div className="absolute self-center md:static bottom-8 md:mr-7 left-5 lg:hidden">
					<button className="border-0" onClick={(e) => setMobileOpen(!mobileOpen)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-10 h-10 p-1 transition-colors duration-200 ease-in-out rounded hover:bg-green-200"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>

				{/* Logo */}
				<a className="flex items-center justify-center mb-4 font-medium title-font md:mb-0">
					<Link href="/">
						<a>
							<Image src="/logo.png" alt="store-logo" width={200} height={50} />
						</a>
					</Link>
				</a>

				{/* Cart button */}
				{session && (
					<div className="absolute self-center block bottom-8 right-5 sm:hidden">
						<button className="justify-start" onClick={handleOpen}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								alt="View Cart"
								className="w-10 h-10 p-1 transition-colors duration-200 ease-in-out bg-white rounded hover:bg-green-200"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
							</svg>
						</button>
					</div>
				)}

				{/* Navbar items */}
				<nav className="flex-wrap items-center justify-center hidden text-base lg:flex md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400">
					{navigationBar.map((tab) => {
						tab.current = router.pathname == tab.href ? true : false;
						return (
							<Link href={tab.href}>
								<a
									key={tab.id}
									className={
										tab.current
											? "self-center bg-green-700 px-3 py-2 mx-3 my-2 font-semibold text-white ease-in-out transition-colors duration-100 rounded-md cursor-pointer"
											: "self-center px-3 py-2 mx-3 my-2 hover:text-white transition-colors ease-in-out duration-200 hover:bg-green-700 rounded-md cursor-pointer"
									}
								>
									{tab.name}
								</a>
							</Link>
						);
					})}
				</nav>

				{/* Desktop menu buttons */}
				{session ? (
					<>
						<Cart open={open} handleOpen={handleOpen} />
						<div className="items-center justify-end flex-1 hidden m-3 sm:flex">
							<a onClick={handleOpen}>
								<div className="m-4 hover:cursor-pointer">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										alt="View Cart"
										className="w-10 h-10 p-1 transition-colors duration-200 ease-in-out bg-white rounded hover:bg-green-100"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
									</svg>
								</div>
							</a>

							<div className="hidden dropdown lg:block">
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
										<a href="#" onClick={logOut}>
											Sign Out
										</a>
									</li>
								</ul>
							</div>
						</div>
					</>
				) : (
					<div className="items-stretch justify-end flex-1 hidden mr-3 sm:flex">
						<div className="flex divide-x divide-gray-800">
							<Link href="/auth/signIn">
								<a className="self-center p-2 font-normal rounded-btn hover:font-medium hover:text-green-700">LOGIN</a>
							</Link>
							<Link href="/register">
								<a className="self-center p-2 font-normal rounded-btn hover:font-medium hover:text-green-700">REGISTER</a>
							</Link>
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export default Navbar;
