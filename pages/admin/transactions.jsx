import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import useAxios from "axios-hooks";
import Loading from "@components/Loading";

const status = ["INCOMING", "PROCESSED", "IN PREPARATION", "READY FOR PICKUP/DELIVERY", "COMPLETED ORDER", "CANCELLED ORDER"];
const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "August", "Sept.", "Oct.", "Nov.", "Dec."];
const statColors = ["bg-red-200", "bg-yellow-200", "bg-[#CF9FFF]", "bg-blue-200", "bg-green-200", "bg-gray-200"];
const statTextColors = ["text-red-900", "text-yellow-900", "text-[#320064]", "text-blue-900", "text-green-900", "text-gray-900"];
const headers = ["Invoice #", "Date Created", "Type", "Status", "When to Deliver/Pickup", ""];
const limit = 10;

export default function Transactions() {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [filter, setFilter] = useState("All");
	const [transactions, setTransactions] = useState([]);
	const [lastUpdate, setLastUpdate] = useState(new Date());

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({ defaultValues: { filter: "All" } });

	const [{ data, loading, error }, refetch] = useAxios({
		url: `${process.env.NEXTAUTH_URL}/api/transactions`,
		params: {
			limit: limit,
			offset: (page - 1) * limit,
			filter: watch("filter") == "All" ? null : Number(watch("filter")),
		},
	});

	// ANCHOR Refetch for pagination
	useEffect(() => {
		setTimeout(() => {
			refetch();
			setLastUpdate(new Date());
		}, 60000);

		if (data) {
			setTransactions(data.transactions);
			watch("filter") == "All" ? setValue("filter", "All") : setValue("filter", data.transactions[0]?.orderStatus);
		}
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

	// let filtered = transactions.filter((transaction) => transaction.orderStatus == filter);
	// if (filter == "All") filtered = transactions;

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className="text-gray-800 font-rale">
					<div className="flex-row pb-5 sm:flex">
						<div className="mb-5 text-xl text-2xl font-bold sm:mb-0 sm:text-3xl">Manage Transactions</div>
						<div className="flex-row self-center flex-1 sm:ml-5">
							<form>
								<span className="mr-2 font-bold">Order Status</span>
								<select
									onChange={(e) => setFilter(e.target.value)}
									className="max-w-xs px-2 py-1 border rounded w-fit md:w-1/2 lg:w-full focus:border-1 focus:outline-none focus:border-green-700"
									{...register("filter")}
								>
									<option>All</option>
									<option value={0}>Incoming</option>
									<option value={1}>Processed</option>
									<option value={2}>In Preparation</option>
									<option value={3}>Ready for Pickup/Delivery</option>
									<option value={4}>Completed Orders</option>
									<option value={5}>Cancelled Orders</option>
								</select>
							</form>
						</div>
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
									{transactions.map((item, index) => {
										return (
											<tr className="border-b border-gray-300 h-14">
												<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">#{item.invoiceNum}</td>
												<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">{formatDate(item.dateCreated)}</td>
												<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">{item.type}</td>

												<td className={`px-6 text-xs leading-4 tracking-normal whitespace-no-wrap`}>
													<div className={`${statColors[item.orderStatus]} w-fit py-1 px-2 rounded`}>
														<span className={`font-medium ${statTextColors[item.orderStatus]}`}>{status[item.orderStatus]}</span>
													</div>
												</td>
												<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">
													{item.type === "Delivery" // If transaction type is delivery
														? item.deliverTime !== "Now" // Check if deliver time is undefined or not
															? formatDate(item.deliverTime) // Format date if true
															: "Now" // Else, continue to display as "Now"
														: item.pickupTime !== "Now"
														? formatDate(item.pickupTime)
														: "Now"}
												</td>
												<Link href={`/admin/orders/${item.invoiceNum}`}>
													<td className="px-5 text-xs text-center transition-colors bg-green-700 border-b border-gray-200 cursor-pointer hover:bg-green-600">
														<a className="font-bold text-white">View</a>
													</td>
												</Link>
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
									transactions.length === 0 || transactions.length < 10 ? "hidden" : "block"
								} px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-green-700 border rounded hover:bg-green-600 focus:outline-none`}
							>
								Next
							</button>
						</div>
					</div>
					{/* !SECTION */}
				</div>
			)}
		</>
	);
}

Transactions.layout = "admin";
