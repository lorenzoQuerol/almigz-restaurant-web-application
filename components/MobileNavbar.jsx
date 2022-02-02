import { Fragment, useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

const MobileNavbar = ({ mobileOpen, setMobileOpen }) => {
	const router = useRouter();
	const { data: session, status } = useSession();

	const handleSignOut = async (event) => {
		event.preventDefault();
		signOut({ redirect: true, callbackUrl: "/" });
		localStorage.clear();
	};

	let navigationBar = [
		{ id: "0", href: "/", name: "Home", current: true },
		{ id: "1", href: "/menu", name: "Menu", current: false },
		{ id: "2", href: "/about", name: "About Us", current: false },
		{ id: "3", href: "/admin", name: "Admin", current: false },
		{ id: "4", href: "/signin", name: "Login", current: false },
		{ id: "5", href: "/register", name: "Register", current: false },
		{ id: "6", href: "/account", name: "Account Settings", current: false },
		{ id: "7", href: "/history", name: "Orders", current: false },
		{ id: "8", href: "#", name: "Logout", current: false },
	];

	// useEffect(() => {
	// 	if (session) {
	// 		navigationBar[3].visible = navigationBar[4].visible = navigationBar[5].visible = false; // make login, register, admin invisible
	// 		navigationBar[6].visible = navigationBar[7].visible = navigationBar[8].visible = true; // make account settings, orders, logout visible
	// 		if (session.user.isAdmin) navigationBar[3].visible = true; // if user is admin, make admin visible
	// 	} else {
	// 		navigationBar[3].visible = navigationBar[6].visible = navigationBar[7].visible = navigationBar[8].visible = false;
	// 	}
	// }, [session]);

	return (
		<Transition.Root show={mobileOpen} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setMobileOpen}>
				<div className="absolute inset-0 overflow-hidden">
					<Transition.Child
						as={Fragment}
						enter="ease-in-out duration-500"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in-out duration-500"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="absolute inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
					</Transition.Child>

					<div className="fixed inset-y-0 left-0 flex max-w-full pr-10 font-semibold text-gray-800 font-rale">
						<Transition.Child
							as={Fragment}
							enter="transform transition ease-in-out duration-500 sm:duration-700"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transform transition ease-in-out duration-500 sm:duration-700"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<div className="w-screen max-w-md">
								<div className="flex flex-col h-full overflow-y-scroll bg-white shadow-xl">
									<div className="flex-1 px-4 py-6 overflow-y-auto sm:px-6">
										{/* Greeting and close panel */}
										<div className="flex items-end justify-between">
											{session && <Dialog.Title className="text-xl font-semibold">Hi, {session.user.name}!</Dialog.Title>}
											{!session && <Dialog.Title className="text-xl font-semibold">Welcome!</Dialog.Title>}
											<div className="flex items-center ml-3 h-7">
												<button type="button" className="p-2 -m-2 hover:text-gray-500" onClick={() => setMobileOpen(false)}>
													<span className="sr-only">Close panel</span>
													<XIcon className="w-6 h-6" aria-hidden="true" />
												</button>
											</div>
										</div>

										{/* General navigation */}
										<div className="my-12">
											<div className="flow-root">
												<ul role="list" className="-my-6 divide-gray-200">
													{/* ANCHOR Home */}
													<Link href={navigationBar[0].href} key={navigationBar[0].id}>
														<a onClick={(e) => setMobileOpen(!mobileOpen)}>
															<li
																className={
																	navigationBar[0].href == router.pathname
																		? "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md text-white bg-green-700"
																		: "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md hover:text-white hover:bg-green-700"
																}
															>
																{navigationBar[0].name}
															</li>
														</a>
													</Link>

													{/* ANCHOR Menu */}
													<Link href={navigationBar[1].href} key={navigationBar[1].id}>
														<a onClick={(e) => setMobileOpen(!mobileOpen)}>
															<li
																className={
																	navigationBar[1].href == router.pathname
																		? "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md text-white bg-green-700"
																		: "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md hover:text-white hover:bg-green-700"
																}
															>
																{navigationBar[1].name}
															</li>
														</a>
													</Link>

													{/* ANCHOR About us */}
													<Link href={navigationBar[2].href} key={navigationBar[2].id}>
														<a onClick={(e) => setMobileOpen(!mobileOpen)}>
															<li
																className={
																	navigationBar[2].href == router.pathname
																		? "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md text-white bg-green-700"
																		: "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md hover:text-white hover:bg-green-700"
																}
															>
																{navigationBar[2].name}
															</li>
														</a>
													</Link>
													<span className="flex w-full border-2"></span>

													{/* ANCHOR Admin */}
													{session && session.user.isAdmin && (
														<Link href={navigationBar[3].href} key={navigationBar[3].id}>
															<a onClick={(e) => setMobileOpen(!mobileOpen)}>
																<li
																	className={
																		navigationBar[3].href == router.pathname
																			? "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md text-white bg-green-700"
																			: "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md hover:text-white hover:bg-green-700"
																	}
																>
																	{navigationBar[3].name}
																</li>
															</a>
														</Link>
													)}

													{/* ANCHOR Login */}
													{!session && (
														<Link href={navigationBar[4].href} key={navigationBar[4].id}>
															<a onClick={(e) => setMobileOpen(!mobileOpen)}>
																<li
																	className={
																		navigationBar[4].href == router.pathname
																			? "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md text-white bg-green-700"
																			: "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md hover:text-white hover:bg-green-700"
																	}
																>
																	{navigationBar[4].name}
																</li>
															</a>
														</Link>
													)}

													{/* ANCHOR Register */}
													{!session && (
														<Link href={navigationBar[5].href} key={navigationBar[5].id}>
															<a onClick={(e) => setMobileOpen(!mobileOpen)}>
																<li
																	className={
																		navigationBar[5].href == router.pathname
																			? "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md text-white bg-green-700"
																			: "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md hover:text-white hover:bg-green-700"
																	}
																>
																	{navigationBar[5].name}
																</li>
															</a>
														</Link>
													)}

													{/* ANCHOR Account Settings */}
													{session && (
														<Link href={navigationBar[6].href} key={navigationBar[6].id}>
															<a onClick={(e) => setMobileOpen(!mobileOpen)}>
																<li
																	className={
																		navigationBar[6].href == router.pathname
																			? "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md text-white bg-green-700"
																			: "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md hover:text-white hover:bg-green-700"
																	}
																>
																	{navigationBar[6].name}
																</li>
															</a>
														</Link>
													)}

													{/* ANCHOR Orders */}
													{session && (
														<Link href={navigationBar[7].href} key={navigationBar[7].id}>
															<a onClick={(e) => setMobileOpen(!mobileOpen)}>
																<li
																	className={
																		navigationBar[7].href == router.pathname
																			? "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md text-white bg-green-700"
																			: "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md hover:text-white hover:bg-green-700"
																	}
																>
																	{navigationBar[7].name}
																</li>
															</a>
														</Link>
													)}

													{/* ANCHOR Logout */}
													{session && (
														<Link href={navigationBar[8].href} key={navigationBar[8].id}>
															<a
																onClick={(e) => {
																	setMobileOpen(!mobileOpen);
																	handleSignOut(e);
																}}
															>
																<li
																	className={
																		navigationBar[8].href == router.pathname
																			? "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md text-white bg-green-700"
																			: "transition-colors duration-200 flex py-3 px-3 my-2 rounded-md hover:text-white hover:bg-green-700"
																	}
																>
																	{navigationBar[8].name}
																</li>
															</a>
														</Link>
													)}
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default MobileNavbar;
