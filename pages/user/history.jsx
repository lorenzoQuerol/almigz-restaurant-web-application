import { Fragment, useState, useEffect } from "react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Listbox, Transition } from "@headlessui/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import Link from "next/link";
import useAxios from "axios-hooks";
import Loading from "@components/Loading";

const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
const statusDelivery = ["Submitted", "Processed", "Preparing", "In Transit", "Complete", "Cancelled"];
const statusPickup = ["Submitted", "Processed", "Preparing", "Ready for Pickup", "Complete", "Cancelled"];
const statColors = ["bg-red-100", "bg-yellow-100", "bg-[#CF9FFF]", "bg-blue-100", "bg-green-100", "bg-gray-100"];
const statTextColors = ["text-red-700", "text-yellow-70", "text-[#320064]", "text-blue-700", "text-green-700", "text-gray-700"];
const filters = ["Latest", "Oldest", "Price: Lowest to Highest", "Price: Highest to Lowest"];
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

	return {
		props: session,
	};
}

export default function History(session) {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [transactions, setTransactions] = useState([]);
	const [selected, setSelected] = useState(filters[0]);

	const [{ data, loading, error }, refetch] = useAxios({
		url: `/api/history/${session.user.email}`,
		params: {
			limit: limit,
			offset: (page - 1) * limit,
			filter: selected,
		},
	});

	useEffect(() => {
		if (data) setTransactions(data.transactions);
	}, [data]);

	const handlePrevPage = () => {
		setPage(Math.max(1, page - 1));
		refetch();
	};

	const handleNextPage = () => {
		setPage(Math.max(1, page + 1));
		refetch();
	};

	useEffect(() => {
		refetch();
	}, [selected]);

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
			<div className="w-full sm:w-11/12 lg:w-9/12">
				<div className="pb-6 border border-gray-200 rounded-lg shadow">
					{/* ANCHOR Headers */}
					<div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
						<p className="text-lg font-semibold leading-tight text-gray-800 lg:text-xl">My Orders</p>
						<Listbox value={selected} onChange={setSelected}>
							<div className="relative block w-7/12 mt-1 sm:w-1/2 md:w-1/3 xl:w-1/4">
								<Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border rounded-lg shadow cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
									<span className="block truncate">{selected}</span>
									<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
										<SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
									</span>
								</Listbox.Button>
								<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
									<Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
										{filters.map((person, personIdx) => (
											<Listbox.Option
												key={personIdx}
												className={({ active }) =>
													`${active ? "text-amber-900 bg-amber-100" : "text-gray-900"}
                          cursor-default select-none relative py-2 pl-10 pr-4`
												}
												value={person}
											>
												{({ selected, active }) => (
													<>
														<span className={`${selected ? "font-medium" : "font-normal"} block truncate`}>{person}</span>
														{selected ? (
															<span
																className={`${active ? "text-amber-600" : "text-amber-600"}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
															>
																<CheckIcon className="w-5 h-5" aria-hidden="true" />
															</span>
														) : null}
													</>
												)}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</Transition>
							</div>
						</Listbox>
						{/* <div className="flex w-1/2 cursor-pointer items-center justify-center px-3 py-2.5 border rounded border-gray-100"></div> */}
					</div>

					{/* ANCHOR Content */}
					<div className="px-6 overflow-x-auto">
						{loading ? (
							<div className="mt-10">
								<Loading />
							</div>
						) : (
							<table className="w-full whitespace-nowrap ">
								<tbody className="divide-y divide-solid">
									{transactions.map((transaction) => {
										return (
											<tr>
												<td>
													<div className="flex items-center py-3 xl:mr-56">
														<Link href={`/tracker/${transaction.invoiceNum}`}>
															<div className="transition-colors hover:bg-green-600 bg-green-700 rounded-sm p-2.5 cursor-pointer">
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
																			<span className="truncate">
																				{food.quantity}x {food.menuItem.productName}
																			</span>
																		);
																	} else {
																		return (
																			<span className="truncate">
																				{food.quantity}x {food.menuItem.productName}, {"  "}
																			</span>
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
						)}

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
										transactions.length === 0 ? "hidden" : "block"
									} px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-green-700 border rounded hover:bg-green-600 focus:outline-none`}
								>
									Next
								</button>
							</div>
							{/* <button
									onClick={handlePrevPage}
									className={`${
										page === 1 ? "hidden" : "flex"
									} items-center px-4 py-2 mx-1 font-medium bg-green-700 rounded-md hover:bg-green-600 cursor-pointer`}
								>
									Previous
								</button>

								<button
									onClick={handleNextPage}
									className="flex items-center px-4 py-2 mx-1 font-medium transition-colors duration-200 transform bg-green-700 rounded-md hover:bg-green-600 hover:text-white"
								>
									Next
								</button> */}
						</div>
						{/* !SECTION */}
					</div>
				</div>
			</div>
		</div>
	);
}
