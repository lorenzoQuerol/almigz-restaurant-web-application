import { useState, useEffect } from "react";
import { makeUseAxios } from "axios-hooks";
import Link from "next/link";
import axios from "axios";
import Loading from "@components/Loading";

const statColors = ["text-red-700", "text-yellow-700", "text-[#320064]", "text-blue-700", "text-green-700", "text-gray-700"];

// Axios instances
const getCompleteTransactions = makeUseAxios({
	axios: axios.create({ baseURL: process.env.NEXTAUTH_URL }),
});
const getActiveTransactions = makeUseAxios({
	axios: axios.create({ baseURL: process.env.NEXTAUTH_URL }),
});

const getAllUsers = makeUseAxios({
	axios: axios.create({ baseURL: process.env.NEXTAUTH_URL }),
});

const getAllTransactions = makeUseAxios({
	axios: axios.create({ baseURL: process.env.NEXTAUTH_URL }),
});

const Dashboard = ({ session, setCurrentTab }) => {
	// Complete transactions count
	const [{ data: completeTransactions, loading: loadingComplete, error: errorComplete }, refetchComplete] = getCompleteTransactions({
		url: `/api/count`,
		params: {
			filter: "complete",
		},
	});

	// Active transactions count
	const [{ data: activeTransactions, loading: loadingActive, error: errorActive }, refetchActive] = getActiveTransactions({
		url: `/api/count`,
		params: {
			filter: "active",
		},
	});

	// All registered users
	const [{ data: users, loading: loadingUsers, error: errorUsers }, refetchUsers] = getAllUsers({
		url: `/api/count`,
		params: {
			filter: "users",
		},
	});

	// All transactions
	const [{ data: allTransactions, loading: loadingAllTransactions, error: errorAllTransactions }, refetchAllTransaction] = getAllTransactions({
		url: `/api/transactions`,
	});

	// First row values
	const [completeValue, setCompleteValue] = useState(0);
	const [activeValue, setActiveValue] = useState(0);
	const [usersValue, setUsersValue] = useState(0);

	// Second row values
	const [transactions, setTransactions] = useState([]);
	const [incoming, setIncoming] = useState(0);
	const [processed, setProcessed] = useState(0);
	const [prepare, setPrepare] = useState(0);
	const [ready, setReady] = useState(0);

	useEffect(() => {
		if (completeTransactions) setCompleteValue(completeTransactions.count);
		if (activeTransactions) setActiveValue(activeTransactions.count);
		if (users) setUsersValue(users.count);
		if (allTransactions) setTransactions(allTransactions.transactions);
		if (transactions) {
			setIncoming(transactions.filter((t) => t.orderStatus === 0));
			setProcessed(transactions.filter((t) => t.orderStatus === 1));
			setPrepare(transactions.filter((t) => t.orderStatus === 2));
			setReady(transactions.filter((t) => t.orderStatus === 3));
		}
	}, [users, completeTransactions, activeTransactions, allTransactions, transactions]);

	return (
		<div className="w-full m-10 font-rale text-slate-900">
			{loadingUsers || loadingActive || loadingComplete || loadingAllTransactions ? (
				<Loading />
			) : (
				<>
					{/* Greeting */}
					<div className="mb-5 text-4xl font-extrabold">
						<a className="text-green-700">Welcome,</a> {session.user.name}
					</div>

					{/* SECTION First row */}
					<div className="grid grid-flow-col mb-5 justify-items-stretch">
						{/* ANCHOR Completed orders */}
						<div className="px-5 py-4 mx-2 rounded-md bg-zinc-100 shadow-m drop-shadow-lg">
							<div className="mt-2">
								<div className="flex">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
									</svg>
									<span className="ml-2 text-xl font-bold text-green-700">Completed Orders</span>
								</div>
								<div className="flex-1">
									<div className="text-4xl font-semibold text-center py-9">{completeValue}</div>
								</div>
							</div>
						</div>

						{/* ANCHOR Active orders */}
						<div className="px-5 py-4 mx-2 rounded-md bg-zinc-100 shadow-m drop-shadow-lg">
							<div className="mt-2">
								<div className="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
										/>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span className="ml-2 text-xl font-bold text-green-700">Active Orders</span>
								</div>
								<div className="flex-1">
									<div className="text-4xl font-semibold text-center py-9">{activeValue}</div>
								</div>
							</div>
						</div>

						{/* ANCHOR Unique users */}
						<div className="px-5 py-4 mx-2 rounded-md bg-zinc-100 shadow-m drop-shadow-lg">
							<div className="mt-2">
								<div className="flex">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									<span className="ml-2 text-xl font-bold text-green-700">Registered Users</span>
								</div>
								<div className="flex-1">
									<div className="text-4xl font-semibold text-center py-9">{usersValue}</div>
								</div>
							</div>
						</div>
					</div>
					{/* !SECTION */}

					{/* SECTION Second row */}
					<div className="mx-2 mb-5 rounded-md py-7 px-9 bg-zinc-100 drop-shadow-lg">
						<div className="">
							<div className="flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>

								<span className="ml-2 text-xl font-bold text-green-700">Incoming & Active Orders</span>
							</div>
							<div className="flex flex-row justify-between my-4 font-semibold">
								<div className="flex-col">
									<div className="text-3xl text-center">{incoming.length}</div>
									<div className={`text-center ${statColors[0]}`}>Incoming</div>
								</div>
								<div className="flex-col">
									<div className="text-3xl text-center">{processed.length}</div>
									<div className={`text-center ${statColors[1]}`}>Processed</div>
								</div>
								<div className="flex-col">
									<div className="text-3xl text-center">{prepare.length}</div>
									<div className={`text-center ${statColors[2]}`}>In Preparation</div>
								</div>
								<div className="flex-col">
									<div className="text-3xl text-center">{ready.length}</div>
									<div className={`text-center ${statColors[3]}`}>Ready for Pickup/Delivery</div>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between mt-4">
							<div className="flex items-center px-3 py-1 text-white transition-colors bg-green-700 rounded-md hover:bg-green-600">
								<a onClick={() => setCurrentTab("Transactions")} className="font-medium cursor-pointer">
									Manage Transactions
								</a>
							</div>
						</div>
					</div>
					{/* !SECTION */}

					{/* SECTION Third row */}
					<div className="grid grid-flow-col mb-5 justify-items-stretch">
						{/* ANCHOR Completed orders */}
						<div className="px-5 py-4 mx-2 rounded-md bg-zinc-100 shadow-m drop-shadow-lg">
							<div className="mt-2">
								<div className="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
									</svg>
									<span className="ml-2 text-xl font-bold text-green-700">Add More Items</span>
								</div>
								<div className="flex items-center justify-center">
									<Link href={process.env.CONTENTFUL_URL}>
										<a className="px-4 py-2 mt-5 text-2xl font-semibold text-center text-white bg-green-700 rounded-md cursor-pointer" target="_blank">
											Go to Contentful
										</a>
									</Link>
								</div>
							</div>
						</div>

						{/* ANCHOR Summary report */}
						<div className="px-5 py-4 mx-2 rounded-md bg-zinc-100 shadow-m drop-shadow-lg">
							<div className="mt-2">
								<div className="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<span className="ml-2 text-xl font-bold text-green-700">Summary Report</span>
								</div>
								<div className="flex items-center justify-center">
									<a className="px-4 py-2 mt-5 text-2xl font-semibold text-center text-white bg-green-700 rounded-md cursor-pointer" target="_blank">
										View Reports
									</a>
								</div>
							</div>
						</div>
					</div>
					{/* !SECTION */}
				</>
			)}
		</div>
	);
};
export default Dashboard;
