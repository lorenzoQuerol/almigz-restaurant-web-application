import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

import Cart from "@components/Cart";
import MobileNavbar from "@components/MobileNavbar";

const Navbar = () => {
	const router = useRouter();
	const { data: session, status } = useSession();

	const [open, setOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleSignOut = async (event) => {
		event.preventDefault();
		signOut({ redirect: true, callbackUrl: "/" });
		localStorage.clear();
	};

	const navigationBar = [
		{ id: "1", href: "/", name: "Home", current: true },
		{ id: "2", href: "/menu", name: "Menu", current: false },
		{ id: "3", href: "/about", name: "About Us", current: false },
		{ id: "4", href: "/admin", name: "Admin", current: false },
	];

	const handleOpen = () => {
		setOpen(!open);
	};

	return (
		<header className="text-gray-800 border-t-8 border-green-700 shadow-md body-font">
			<div className="container relative flex flex-col flex-wrap px-5 py-2 mx-auto md:flex-row">
				<MobileNavbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
				{/* Mobile menu button */}
				<div className="absolute self-center md:static bottom-3 md:mr-7 left-5 lg:hidden">
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
				<div className="flex items-center justify-center font-medium title-font md:mb-0">
					<Link href="/">
						<a>
							<Image src="/logo.png" alt="store-logo" width={200} height={50} />
						</a>
					</Link>
				</div>

				{/* Cart button */}
				{session && router.pathname !== "/checkout" && !session.user.isAdmin && (
					<div className="absolute self-center block bottom-3 right-5 sm:hidden">
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

				{/* Navbar items for normal users */}
				<nav className="flex-wrap items-center justify-center hidden text-base lg:flex md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400">
					{navigationBar.map((tab, index) => {
						tab.current = router.pathname == tab.href ? true : false;

						if (tab.id !== "4") {
							return (
								<Link href={tab.href} key={tab.id}>
									<a
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
						}
					})}

					{/* if user is admin, render dashboard */}
					{session && session.user.isAdmin && (
						<Link href={navigationBar[3].href} key={navigationBar[3].id}>
							<a
								className={
									navigationBar[3].current
										? "self-center bg-green-700 px-3 py-2 mx-3 my-2 font-semibold text-white ease-in-out transition-colors duration-100 rounded-md cursor-pointer"
										: "self-center px-3 py-2 mx-3 my-2 hover:text-white transition-colors ease-in-out duration-200 hover:bg-green-700 rounded-md cursor-pointer"
								}
							>
								{navigationBar[3].name}
							</a>
						</Link>
					)}
				</nav>

				{/* Desktop menu buttons */}
				{session ? (
					<>
						<Cart open={open} handleOpen={handleOpen} />
						<div className="items-center justify-end flex-1 hidden sm:flex">
							{router.pathname !== "/checkout" && !session.user.isAdmin && (
								<a onClick={handleOpen}>
									<div className="m-4 text-gray-800 hover:cursor-pointer">
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
							)}

							<div className="hidden text-right top-16 lg:block">
								<Menu as="div" className="relative inline-block text-left">
									<div>
										<Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-800 border-2 border-gray-400 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
											Hi, {session.user.name}!
											<ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 text-gray-800 hover:text-gray-400" aria-hidden="true" />
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											<div className="px-1 py-1 ">
												<Menu.Item>
													{({ active }) => (
														<a
															className={`${
																active ? "bg-green-700 text-white" : "text-gray-800"
															} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
															href="/user/profile"
														>
															My Profile
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															className={`${
																active ? "bg-green-700 text-white" : "text-gray-800"
															} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
															href="/user/history"
														>
															My Orders
														</a>
													)}
												</Menu.Item>
											</div>

											<div className="px-1 py-1">
												<Menu.Item>
													{({ active }) => (
														<a
															onClick={handleSignOut}
															className={`${
																active ? "bg-green-700 text-white" : "text-gray-800"
															} group flex cursor-pointer rounded-md items-center w-full px-2 py-2 text-sm`}
														>
															Logout
														</a>
													)}
												</Menu.Item>
											</div>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</>
				) : (
					<div className="items-stretch justify-end flex-1 hidden mr-3 lg:flex">
						<div className="flex divide-x divide-gray-800">
							<Link href="/signin">
								<a className="self-center p-2 font-normal rounded-btn hover:text-green-700">Login</a>
							</Link>
							<Link href="/register">
								<a className="self-center p-2 font-normal rounded-btn hover:text-green-700">Register</a>
							</Link>
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export default Navbar;
