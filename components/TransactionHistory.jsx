import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

const statusTextDelivery = ["Order Received", "Order Processed", "In Preparation", "In Transit", "Order Complete", "Order Cancelled"];
const statusTextPickup = ["Order Received", "Order Processed", "In Preparation", "Ready for Pickup", "Order Complete", "Order Cancelled"];

const TransactionHistory = ({ transactions }) => {
	return (
		<div className="text-gray-500 rounded-md bg-zinc-100 card drop-shadow-lg">
			<div className="text-sm md:text-md card-body">
				{transactions.length ? (
					<div className="w-full">
						{transactions.map((item) => {
							let date = new Date(item.dateCreated);
							let formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} @ ${date.getHours()}:${date.getMinutes()}`;
							let link = `/tracker/${encodeURIComponent(item.invoiceNum)}`;

							return (
								<Disclosure>
									{({ open }) => (
										<>
											<div className="flex justify-between rounded-md">
												<div className="flex p-2 bg-white rounded-l-md">
													<Disclosure.Button className="mr-2">
														<ChevronUpIcon
															className={`rounded-md transition duration-200 ${
																open ? "transform rotate-0" : "transform rotate-180"
															} w-10 h-10 text-green-700`}
														/>
													</Disclosure.Button>
													<div className="text-left">
														<div className="text-xl font-bold text-slate-900">
															{item.type === "Delivery" ? statusTextDelivery[item.orderStatus] : statusTextPickup[item.orderStatus]}
														</div>
														<div>
															Ordered On: <a className="font-semibold text-slate-900">{formattedDate}</a>
														</div>
														<div className="flex">
															<div className="mr-1">Items:</div>
															<div className="flex w-full truncate">
																{item.order.map((food, index) => {
																	if (item.order.length - 1 === index) {
																		return (
																			<>
																				{food.quantity}x {food.menuItem.productName}
																			</>
																		);
																	} else {
																		return (
																			<>
																				{food.quantity} x {food.menuItem.productName},{" "}
																			</>
																		);
																	}
																})}
															</div>
														</div>
													</div>
												</div>
												<div className="flex-1 p-2 text-right bg-white">
													<div>
														Total Price: <a className="font-semibold text-slate-900">₱{item.totalPrice}</a>
													</div>
													<div>
														Method: <a className="font-semibold text-slate-900">{item.payMethod}</a>
													</div>
												</div>

												<div className="flex items-center flex-shrink transition-all bg-green-700 cursor-pointer hover:rounded-r-xl hover:-translate-x-1 hover:bg-green-600">
													<Link href={`/tracker/${encodeURIComponent(item.invoiceNum)}`}>
														<a className="px-3 font-semibold text-white">Tracker</a>
													</Link>
												</div>
											</div>
											<Disclosure.Panel>
												<div className="p-4 m-2 font-semibold bg-white rounded-b-lg shadow-inner text-slate-900">
													<div className="py-2">
														<div className="font-bold text-green-700">{item.type === "Delivery" ? "Delivered to" : "Pickup at"}</div>
														<div>{item.type === "Delivery" ? item.address : item.storeLocation}</div>
													</div>
													<div className="py-2 border-t-2">
														<div className="font-bold text-green-700">Order Summary</div>
														{item.order.map((food) => {
															return (
																<div className="w-3/4 font-semibold truncate text-slate-900">
																	<a className="mr-10">{food.quantity}x</a> {food.menuItem.productName}
																</div>
															);
														})}
													</div>
													<div className="w-full border-t-2">
														<div className="w-1/3 pt-2 ">
															<div className="flex justify-between text-right">
																<div className="text-left">Subtotal</div>
																<div>₱ {item.type === "Delivery" ? item.totalPrice - 50 : item.totalPrice}</div>
															</div>
															<div className="flex justify-between text-right">
																<div className="text-left">Delivery Fee</div>
																<div>{item.type === "Delivery" ? "₱ 50" : "-"}</div>
															</div>
															<div className="flex justify-between text-right">
																<div className="font-bold text-left text-green-700">Total</div>
																<div>₱ {item.totalPrice}</div>
															</div>
														</div>
													</div>
												</div>
											</Disclosure.Panel>
										</>
									)}
								</Disclosure>
							);
						})}
					</div>
				) : (
					<div className="self-center text-lg font-bold text-center lg:text-2xl">You currently have no transactions</div>
				)}
			</div>
		</div>
	);
};

export default TransactionHistory;
