import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { getSession, signOut } from "next-auth/react";
import Link from "next/link";
import useAxios from "axios-hooks";
import ViewUserDialog from "@components/ViewUserDialog";
import Loading from "@components/Loading";

const headers = ["Full Name", "Email", "Role", "Contact Number 1", "Contact Number 2", ""];
const roleTextColors = ["text-green-900", "text-yellow-900"];
const roleBgColors = ["bg-green-200", "bg-yellow-200"];
const limit = 10;

export async function getServerSideProps(context) {
	const session = await getSession(context);

	if (!session)
		return {
			redirect: {
				permanent: false,
				destination: "/signin",
			},
		};

	if (!session.user.isAdmin)
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		};

	return {
		props: session,
	};
}

export default function Management(session) {
	// SECTION Initialization and Declaration
	const [page, setPage] = useState(1);
	const [users, setUsers] = useState([]);
	const [currentUser, setCurrentUser] = useState({});
	const [openViewUser, setOpenViewUser] = useState(false);
	const [{ data, loading, error }, refetch] = useAxios({
		url: `${process.env.NEXTAUTH_URL}/api/users`,
		params: { limit: limit, offset: (page - 1) * limit },
	});
	// !SECTION

	useEffect(() => {
		if (data) setUsers(data.users);
	}, [data]);

	const handleCloseViewUser = () => {
		setOpenViewUser(!openViewUser);
	};

	const handleOpenViewUser = (item) => {
		setCurrentUser(item);
		setOpenViewUser(!openViewUser);
	};

	const handlePrevPage = () => {
		setPage(Math.max(1, page - 1));
	};

	const handleNextPage = () => {
		setPage(Math.max(1, page + 1));
	};

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<>
					<ViewUserDialog user={currentUser} refetch={refetch} handleCloseViewUser={handleCloseViewUser} openViewUser={openViewUser} setOpenViewUser={setOpenViewUser} />
					<div className="text-gray-800 font-rale">
						<div className="flex pb-5 ">
							<div className="text-xl font-bold sm:text-3xl">Manage Users</div>
						</div>
						<div className="container mx-auto bg-white rounded shadow">
							{/* SECTION Table */}
							<div className="w-full overflow-x-scroll xl:overflow-x-hidden">
								<table className="min-w-full bg-white">
									<thead>
										<tr className="w-full h-16 py-8 border-b border-gray-300">
											{headers.map((item, index) => {
												return <th className="px-6 text-sm font-medium leading-4 tracking-normal text-left">{item}</th>;
											})}
										</tr>
									</thead>
									<tbody>
										{users.map((item, index) => {
											return (
												<tr className="border-b border-gray-300 h-14">
													<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">
														{item.firstName} {item.lastName}
													</td>
													<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">{item.email}</td>

													<td className={`px-6 text-xs leading-4 tracking-normal whitespace-no-wrap`}>
														<div className={`${item.isAdmin ? roleBgColors[0] : roleBgColors[1]} w-fit py-1 px-2 rounded`}>
															<span className={`font-medium ${item.isAdmin ? roleTextColors[0] : roleTextColors[1]}`}>
																{item.isAdmin ? "Admin" : "Regular"}
															</span>
														</div>
													</td>
													<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">{item.contact1}</td>
													<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">{item.contact2}</td>
													{session.user.email !== item.email ? (
														<td
															onClick={(e) => handleOpenViewUser(item)}
															className="px-5 text-xs text-center transition-colors bg-green-700 border-b border-gray-200 cursor-pointer hover:bg-green-600"
														>
															<a className="font-bold text-white">View</a>
														</td>
													) : (
														<td className="bg-white border-b border-gray-200"></td>
													)}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>

						{/* SECTION Pagination */}
						<div className="flex self-center justify-between text-white lg:space-x-10 lg:justify-center">
							<div className="flex flex-col mt-3 w-52">
								<button
									type="button"
									onClick={handlePrevPage}
									className={`${
										page === 1 ? "hidden" : "block"
									} px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-green-700 border rounded hover:bg-green-600 focus:outline-none`}
								>
									Previous
								</button>
							</div>
							<div className="flex flex-col mt-3 w-52">
								<button
									type="button"
									onClick={handleNextPage}
									className={`${
										users.length === 0 || users.length < 10 ? "hidden" : "block"
									} px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-green-700 border rounded hover:bg-green-600 focus:outline-none`}
								>
									Next
								</button>
							</div>
						</div>
						{/* !SECTION */}
					</div>
				</>
			)}
		</>
	);

	return (
		<div className="w-full m-10 font-rale">
			{loading ? (
				<Loading />
			) : (
				<>
					{/* Greeting */}
					<ViewUserDialog user={currentUser} refetch={refetch} handleCloseViewUser={handleCloseViewUser} openViewUser={openViewUser} setOpenViewUser={setOpenViewUser} />
					<div className="mb-5 text-4xl font-extrabold">Manage Members</div>
					<div className="mx-auto overflow-hidden rounded-lg shadow-md w-fulll bg-zinc-100">
						<div className="p-6">
							<table className="min-w-full leading-normal">
								<thead>
									<tr>
										{headers.map((item, map) => {
											return (
												<th scope="col" className="px-5 py-3 text-sm font-bold text-left text-gray-800 uppercase bg-white border-b border-gray-200">
													{item}
												</th>
											);
										})}
									</tr>
								</thead>
								<tbody>
									{users.map((item, index) => {
										return (
											<tr key={index}>
												<td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{item.firstName}</td>
												<td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{item.lastName}</td>
												<td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{item.email}</td>
												<td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
													<span
														className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
															item.isAdmin ? roleTextColors[0] : roleTextColors[1]
														}`}
													>
														<span
															aria-hidden="true"
															className={`absolute inset-0 ${item.isAdmin ? roleBgColors[0] : roleBgColors[1]} rounded-full opacity-50`}
														></span>
														<span className="relative">{item.isAdmin ? "Admin" : "Regular"}</span>
													</span>
												</td>
												<td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{item.contact1}</td>
												<td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{item.contact2}</td>

												{session.user.email !== item.email ? (
													<td
														onClick={(e) => handleOpenViewUser(item)}
														className="px-5 text-sm text-center transition-all bg-green-700 border-b border-gray-200 cursor-pointer hover:rounded-l-xl hover:bg-green-600"
													>
														<a className="font-bold text-white">View</a>
													</td>
												) : (
													<td className="bg-white border-b border-gray-200"></td>
												)}
											</tr>
										);
									})}
								</tbody>
							</table>

							{/* SECTION Pagination */}
							<div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
								<div className="flex items-center">
									<button type="button" onClick={handlePrevPage} className="w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100">
										<svg width="9" fill="currentColor" height="8" className="" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
											<path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
										</svg>
									</button>
									<button
										type="button"
										onClick={handleNextPage}
										className="w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
									>
										<svg width="9" fill="currentColor" height="8" className="" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
											<path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
										</svg>
									</button>
								</div>
							</div>
							{/* !SECTION */}
						</div>
					</div>
					<div className="rounded-md card bg-zinc-100 drop-shadow-lg">
						<div className="card-body"></div>
					</div>
				</>
			)}
		</div>
	);
}

Management.layout = "admin";
