import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import useAxios from "axios-hooks";

import Loading from "@components/Loading";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const statusDelivery = ["Incoming", "Processed", "Preparing", "In Transit", "Complete", "Cancelled"];
const statusPickup = ["Incoming", "Processed", "Preparing", "Ready for Pickup", "Complete", "Cancelled"];

const statColors = ["bg-red-100", "bg-yellow-100", "bg-[#CF9FFF]", "bg-blue-100", "bg-green-100", "bg-gray-100"];
const statTextColors = ["text-red-700", "text-yellow-70", "text-[#320064]", "text-blue-700", "text-green-700", "text-gray-700"];

export async function getServerSideProps(context) {
	const session = await getSession(context);

	if (!session)
		return {
			redirect: {
				permanent: false,
				destination: "/signin",
			},
		};

	return {
		props: session,
	};
}

export default function History(session) {
	const router = useRouter();
	const [{ data, loading, error }, refetch] = useAxios({ url: `/api/history/${session.user.email}` });

	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
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
		return `${formatDate}, ${time}`;
	};

	return (
		<div className="flex justify-center mx-2 my-10">
			{loading ? (
				<Loading />
			) : (
				<div className="w-full sm:w-11/12 lg:w-9/12">
					<div className="pb-6 border border-gray-200 rounded-lg shadow">
						{/* ANCHOR Headers */}
						<div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
							<p className="text-lg font-semibold leading-tight text-gray-800 lg:text-xl">My Orders</p>
							<div className="flex cursor-pointer items-center justify-center px-3 py-2.5 border rounded border-gray-100">
								<p className="text-xs leading-none text-gray-600 md:text-sm">Filter by: Latest</p>
							</div>
						</div>

						{/* ANCHOR Content */}
						<div className="px-6 overflow-x-auto">
							<table className="w-full whitespace-nowrap ">
								<tbody className="divide-y divide-solid">
									{transactions.map((transaction) => {
										return (
											<tr>
												<td>
													<div className="flex items-center py-3 xl:mr-56">
														<Link href={`/tracker/${transaction.invoiceNum}`}>
															<div className="bg-green-700 rounded-sm p-2.5 cursor-pointer">
																<svg
																	className="text-white transition-transform hover:translate-x-1"
																	xmlns="http://www.w3.org/2000/svg"
																	width={28}
																	height={28}
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																>
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
																</svg>
															</div>
														</Link>
														<div className="pl-3">
															<div className="flex items-center text-sm leading-none">
																<p className="font-semibold text-gray-800">{formatDate(transaction.dateCreated)}</p>
																<div
																	className={`flex sm:hidden items-center justify-center px-4 py-1 ml-4 ${
																		statColors[transaction.orderStatus]
																	} rounded-full`}
																>
																	<p className={`text-xs font-semibold leading-3 ${statTextColors[transaction.orderStatus]}`}>
																		{transaction.type == "Delivery"
																			? statusDelivery[transaction.orderStatus]
																			: statusPickup[transaction.orderStatus]}
																	</p>
																</div>
															</div>

															<p className="mt-2 text-xs text-gray-600 truncate md:text-sm">
																{transaction.order.map((food, index) => {
																	if (transaction.order.length - 1 === index) {
																		return (
																			<>
																				{food.quantity}x {food.menuItem.productName}
																			</>
																		);
																	} else {
																		return (
																			<>
																				{food.quantity}x {food.menuItem.productName},{" "}
																			</>
																		);
																	}
																})}
															</p>
														</div>
													</div>
												</td>

												<td>
													<div className="hidden py-3 pl-16 sm:block">
														<p className="text-sm font-semibold leading-none text-right text-gray-800">₱{transaction.totalPrice}</p>
														<div className={`flex items-center justify-center py-1 mt-2 ${statColors[transaction.orderStatus]} rounded-full`}>
															<p className={`text-xs font-semibold leading-3 ${statTextColors[transaction.orderStatus]}`}>
																{transaction.type == "Delivery" ? statusDelivery[transaction.orderStatus] : statusPickup[transaction.orderStatus]}
															</p>
														</div>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
