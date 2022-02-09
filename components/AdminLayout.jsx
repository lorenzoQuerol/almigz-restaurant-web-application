import { React, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { XIcon } from "@heroicons/react/outline";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import DashboardIcon from "@components/DashboardIcon";
import PeopleIcon from "@components/PeopleIcon";
import TicketIcon from "@components/TicketIcon";
import CogIcon from "@components/CogIcon";

const AdminLayout = ({ children }) => {
	const router = useRouter();
	const { data: session, status } = useSession();

	const [show, setShow] = useState(false);
	const [profile, setProfile] = useState(false);

	const navigationBar = [
		{ id: 1, href: "/admin", name: "Dashboard", svg: <DashboardIcon />, current: true },
		{ id: 2, href: "/admin/transactions", name: "Transactions", svg: <TicketIcon />, current: false },
		{ id: 3, href: "/admin/management", name: "Management", svg: <PeopleIcon />, current: false },
		{ id: 4, href: "/admin/summary", name: "Summary", svg: <PaperIcon />, current: false },
	];

	const handleSignOut = async (event) => {
		event.preventDefault();
		signOut({ redirect: true, callbackUrl: "/" });
		localStorage.clear();
	};

	return (
		<>
			<Head>
				<title>Al Migz Special Binalot</title>
				<link rel="icon" href="/icon.ico" />
			</Head>
			<div className="w-full text-gray-800 bg-zinc-100 font-rale">
				<div className="flex flex-no-wrap">
					{/* SECTION Sidebar starts */}
					<div className="absolute hidden min-h-screen bg-white shadow lg:relative lg:block">
						{/* ANCHOR Logo */}
						<div className="flex items-center w-full h-16 px-8">
							<Image src="/logo.png" width={200} height={50} />
						</div>

						{/* ANCHOR Navigation */}
						<ul aria-orientation="vertical" className="py-6 ">
							{navigationBar.map((tab, index) => {
								tab.current = router.pathname == tab.href ? true : false;

								return (
									<Link href={tab.href} key={tab.id}>
										<li
											className={`py-5 pl-6 text-sm transition-colors leading-3 tracking-normal ${
												tab.current ? "text-white bg-green-700" : ""
											} cursor-pointer`}
										>
											<div className="flex items-center">
												<div>{tab.svg}</div>
												<span className="ml-2">{tab.name}</span>
											</div>
										</li>
									</Link>
								);
							})}
						</ul>
					</div>
					{/* !SECTION */}

					{/* SECTION Mobile responsive sidebar*/}
					<Transition.Root show={show} as={Fragment}>
						<Dialog as="div" className="fixed inset-0 z-10 overflow-hidden" onClose={setShow}>
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
														<div className="flex items-center ml-3 h-7">
															<button type="button" className="p-2 -m-2 hover:text-gray-500" onClick={() => setShow(false)}>
																<span className="sr-only">Close panel</span>
																<XIcon className="w-6 h-6" aria-hidden="true" />
															</button>
														</div>
													</div>

													{/* General navigation */}
													<div className="my-12">
														<div className="flow-root">
															<ul aria-orientation="vertical">
																{navigationBar.map((tab, index) => {
																	return (
																		<Link href={tab.href} key={tab.id}>
																			<li
																				onClick={() => setShow(false)}
																				className={`py-5 pl-6 text-sm transition-colors leading-3 tracking-normal ${
																					tab.current ? "text-white bg-green-700" : ""
																				} cursor-pointer`}
																			>
																				<div className="flex items-center">
																					<div>{tab.svg}</div>
																					<span className="ml-2">{tab.name}</span>
																				</div>
																			</li>
																		</Link>
																	);
																})}
																<li
																	onClick={handleSignOut}
																	className={`py-5 pl-6 text-sm transition-colors leading-3 tracking-normal cursor-pointer`}
																>
																	<div className="flex items-center">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="w-6 h-6 text-gray-800"
																			fill="none"
																			viewBox="0 0 24 24"
																			stroke="currentColor"
																		>
																			<path
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				strokeWidth={2}
																				d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
																			/>
																		</svg>
																		<span className="ml-2">Logout</span>
																	</div>
																</li>
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
					{/* !SECTION */}

					{/* Sidebar ends */}
					<div className="w-full">
						{/* Navigation starts */}
						<nav className="relative z-10 flex items-center justify-end h-16 bg-white shadow lg:items-stretch lg:justify-between">
							<div className="hidden w-full pr-6 lg:flex">
								<div className="hidden w-full lg:flex">
									<div className="flex items-center justify-end w-full pl-8">
										<div className="relative flex items-center cursor-pointer" onClick={() => setProfile(!profile)}>
											<Menu as="div" className="relative inline-block text-left">
												<div>
													<Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-800 border-2 border-gray-400 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
														{status == "authenticated" && `Hi, ${session.user.name}!`}
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
								</div>
							</div>
							<div className="relative visible mr-8 text-gray-600 lg:hidden" onClick={() => setShow(!show)}>
								{show ? (
									" "
								) : (
									<svg
										aria-label="Main Menu"
										aria-haspopup="true"
										xmlns="http://www.w3.org/2000/svg"
										className="cursor-pointer icon icon-tabler icon-tabler-menu"
										width={30}
										height={30}
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path stroke="none" d="M0 0h24v24H0z" />
										<line x1={4} y1={8} x2={20} y2={8} />
										<line x1={4} y1={16} x2={20} y2={16} />
									</svg>
								)}
							</div>
						</nav>
						{/* Navigation ends */}
						{/* Remove class [ h-64 ] when adding a card block */}
						<div className="container w-full min-h-screen px-6 py-6 mx-auto">
							{/* Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border */}
							<div className="w-full h-full rounded">{children}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminLayout;
