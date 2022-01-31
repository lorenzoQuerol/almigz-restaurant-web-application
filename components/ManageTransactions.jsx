import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useAxios from "axios-hooks";
import Loading from "@components/Loading";

const status = ["INCOMING", "PROCESSED", "IN PREPARATION", "READY FOR PICKUP/DELIVERY", "COMPLETED ORDER", "CANCELLED ORDER"];
const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "August", "Sept.", "Oct.", "Nov.", "Dec."];
const statColors = ["bg-red-200", "bg-yellow-200", "bg-[#CF9FFF]", "bg-blue-200", "bg-green-200", "bg-gray-200"];
const statTextColors = ["text-red-900", "text-yellow-900", "text-[#320064]", "text-blue-900", "text-green-900", "text-gray-900"];
const headers = ["Invoice #", "Date Created", "Type", "Status", "When to Deliver/Pickup", ""];
const limit = 10;

const ManageTransactions = () => {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [filter, setFilter] = useState("All");
	const [transactions, setTransactions] = useState([]);

	const [lastUpdate, setLastUpdate] = useState(new Date());

	const [{ data, loading, error }, refetch] = useAxios({
		url: `${process.env.NEXTAUTH_URL}/api/transactions`,
		params: {
			limit: limit,
			offset: (page - 1) * limit,
			// filter: filter === "All" ? undefined : filter,
		},
	});

	// ANCHOR Refetch for pagination
	useEffect(() => {
		setTimeout(() => {
			refetch();
			setLastUpdate(new Date());
		}, 60000);

		if (data) setTransactions(data.transactions);
	}, [data]);

	const formatDate = (date) => {
		date = new Date(date).toLocaleString("en-US", {
			weekday: "short",
			day: "numeric",
			year: "numeric",
			month: "long",
			hour: "numeric",
			minute: "numeric",
		});
		const tempDate = new Date(date);

		// Get formatted date and time
		const formatDate = `${months[tempDate.getMonth()]} ${tempDate.getDate()}, ${tempDate.getFullYear()}`;
		const time = date.slice(23);

		// Return formatted date
		return `${formatDate} @ ${time}`;
	};

	const handlePrevPage = () => {
		setPage(Math.max(1, page - 1));
		refetch();
	};

	const handleNextPage = () => {
		setPage(Math.max(1, page + 1));
		refetch();
	};

	let filtered = transactions.filter((transaction) => transaction.orderStatus == filter);
	if (filter == "All") filtered = transactions;

	return (
		<div className="w-full m-10 font-rale">
			{loading ? (
				<Loading />
			) : (
				<>
					<div className="flex flex-row mb-3">
						{/* Greeting */}
						<div className="self-center text-4xl font-extrabold">Manage Transactions</div>

						{/* SECTION FILTER LIST BOX */}
						<div className="flex-row self-center flex-1 ml-5">
							<span className="mr-2 font-bold">Order Status</span>
							<select
								onChange={(e) => setFilter(e.target.value)}
								className="w-full max-w-xs rounded-md select select-sm select-bordered focus:ring focus:outline-none focus:ring-green-700"
							>
								<option>All</option>
								<option value={0}>Incoming</option>
								<option value={1}>Processed</option>
								<option value={2}>In Preparation</option>
								<option value={3}>Ready for Pickup/Delivery</option>
								<option value={4}>Completed Orders</option>
								<option value={5}>Cancelled Orders</option>
							</select>
						</div>
						{/* !SECTION */}
					</div>
					<div className="mb-3">Last Updated: {formatDate(lastUpdate.toString())}</div>
					<div className="mx-auto overflow-hidden rounded-lg shadow-md w-fulll bg-zinc-100">
						<div className="p-6">
							{/* SECTION TABLE */}
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
									{filtered.map((item, index) => {
										return (
											<tr>
												<td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{item.invoiceNum}</td>
												<td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
													<p className="text-gray-900 whitespace-no-wrap">{formatDate(item.dateCreated)}</p>
												</td>
												<td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
													<p className="text-gray-900 whitespace-no-wrap">{item.type}</p>
												</td>
												<td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
													<span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${statTextColors[item.orderStatus]}`}>
														<span aria-hidden="true" className={`absolute inset-0 ${statColors[item.orderStatus]} rounded-full opacity-50`}></span>
														<span className="relative">{status[item.orderStatus]}</span>
													</span>
												</td>
												<td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
													<p className="text-gray-900 whitespace-no-wrap">
														{item.type === "Delivery" // If transaction type is delivery
															? item.deliverTime !== "Now" // Check if deliver time is undefined or not
																? formatDate(item.deliverTime) // Format date if true
																: "Now" // Else, continue to display as "Now"
															: item.pickupTime !== "Now"
															? formatDate(item.pickupTime)
															: "Now"}
													</p>
												</td>

												<Link href={`/orders/${item.invoiceNum}`}>
													<td className="px-5 text-sm text-center transition-all bg-green-700 border-b border-gray-200 cursor-pointer hover:rounded-l-xl hover:bg-green-600">
														<a className="font-bold text-white">View</a>
													</td>
												</Link>
											</tr>
										);
									})}
								</tbody>
							</table>
							{/* !SECTION */}

							{/* SECTION Pagination */}
							<div className="flex self-center justify-center mt-5 text-white">
								<button
									onClick={handlePrevPage}
									className={`${
										page === 1 ? "hidden" : "flex"
									} items-center px-4 py-2 mx-1 font-semibold bg-green-700 rounded-md hover:bg-green-600 cursor-pointer`}
								>
									Previous
								</button>

								<button
									onClick={handleNextPage}
									className="flex items-center px-4 py-2 mx-1 font-semibold transition-colors duration-200 transform bg-green-700 rounded-md hover:bg-green-600 hover:text-white"
								>
									Next
								</button>
							</div>
							{/* !SECTION */}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default ManageTransactions;
