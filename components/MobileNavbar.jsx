import { Fragment, useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

const MobileNavbar = ({ mobileOpen, setMobileOpen }) => {
	const router = useRouter();
	const { data: session, status } = useSession();

	const logOut = () => {
		signOut({ callbackUrl: "http://localhost:3000/" });
		localStorage.clear();
	};

	const navigationBar = [
		{ id: "1", href: "/", name: "HOME", current: true },
		{ id: "2", href: "/menu", name: "MENU", current: false },
		{ id: "3", href: "/about", name: "ABOUT US", current: false },
	];

	const userBar = [
		{ id: "1", href: "/auth/signIn", name: "LOGIN", current: false },
		{ id: "2", href: "/register", name: "REGISTER", current: false },
		{ id: "3", href: "/account", name: "MY ACCOUNT", current: false },
		{ id: "4", href: "#", name: "LOGOUT", current: false },
	];

	if (session) {
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

						<div className="fixed inset-y-0 left-0 flex max-w-full pr-10 font-semibold font-rale text-slate-900">
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
												<Dialog.Title className="text-xl font-semibold">Hi, {session.user.name}!</Dialog.Title>
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
														{navigationBar.map((tab) => {
															tab.current = router.pathname == tab.href ? true : false;
															return (
																<Link href={tab.href}>
																	<a onClick={(e) => setMobileOpen(!mobileOpen)}>
																		<li
																			key={tab.id}
																			className={
																				tab.current
																					? "transition-colors duration-200 flex py-3 px-2 rounded-md text-white bg-green-700"
																					: "transition-colors duration-200 flex py-3 px-2 rounded-md hover:text-white hover:bg-green-700"
																			}
																		>
																			{tab.name}
																		</li>
																	</a>
																</Link>
															);
														})}
													</ul>
												</div>
											</div>

											{/* Logged in navigation */}
											{session && (
												<>
													<div className="border-b-2"></div>
													<div className="mt-12">
														<div className="flow-root">
															<ul role="list" className="-my-6 divide-gray-200">
																{userBar.map((tab) => {
																	tab.current = router.pathname == tab.href ? true : false;
																	if (tab.name === "LOGOUT") {
																		return (
																			<Link href={tab.href}>
																				<a
																					onClick={(e) => {
																						logOut();
																						setMobileOpen(!mobileOpen);
																					}}
																				>
																					<li
																						key={tab.id}
																						className={
																							tab.current
																								? "transition-colors duration-200 flex py-3 px-2 rounded-md text-white bg-green-700"
																								: "transition-colors duration-200 flex py-3 px-2 rounded-md hover:text-white hover:bg-green-700"
																						}
																					>
																						{tab.name}
																					</li>
																				</a>
																			</Link>
																		);
																	} else {
																		if (tab.name === "MY ACCOUNT" || tab.name === "LOGOUT") {
																			return (
																				<Link href={tab.href}>
																					<a onClick={(e) => setMobileOpen(!mobileOpen)}>
																						<li
																							key={tab.id}
																							className={
																								tab.current
																									? "transition-colors duration-200 flex py-3 px-2 rounded-md text-white bg-green-700"
																									: "transition-colors duration-200 flex py-3 px-2 rounded-md hover:text-white hover:bg-green-700"
																							}
																						>
																							{tab.name}
																						</li>
																					</a>
																				</Link>
																			);
																		}
																	}
																})}
															</ul>
														</div>
													</div>
												</>
											)}
										</div>
									</div>
								</div>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		);
	} else {
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

						<div className="fixed inset-y-0 left-0 flex max-w-full pr-10 font-semibold font-rale text-slate-900">
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
												<Dialog.Title className="text-xl font-semibold">Welcome!</Dialog.Title>
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
														{navigationBar.map((tab) => {
															tab.current = router.pathname == tab.href ? true : false;

															return (
																<Link href={tab.href}>
																	<a onClick={(e) => setMobileOpen(!mobileOpen)}>
																		<li
																			key={tab.id}
																			className={
																				tab.current
																					? "transition-colors duration-200 flex py-3 px-2 rounded-md text-white bg-green-700"
																					: "transition-colors duration-200 flex py-3 px-2 rounded-md hover:text-white hover:bg-green-700"
																			}
																		>
																			{tab.name}
																		</li>
																	</a>
																</Link>
															);
														})}
													</ul>
												</div>
											</div>
											<div className="border-b-2"></div>
											<div className="mt-12">
												<div className="flow-root">
													<ul role="list" className="-my-6 divide-gray-200">
														{userBar.map((tab) => {
															tab.current = router.pathname == tab.href ? true : false;
															if (tab.name === "LOGIN" || tab.name === "REGISTER") {
																return (
																	<Link href={tab.href}>
																		<a onClick={(e) => setMobileOpen(!mobileOpen)}>
																			<li
																				key={tab.id}
																				className={
																					tab.current
																						? "transition-colors duration-200 flex py-3 px-2 rounded-md text-white bg-green-700"
																						: "transition-colors duration-200 flex py-3 px-2 rounded-md hover:text-white hover:bg-green-700"
																				}
																			>
																				{tab.name}
																			</li>
																		</a>
																	</Link>
																);
															}
														})}
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
	}
};

export default MobileNavbar;
