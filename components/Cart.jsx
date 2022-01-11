import { Fragment, useState, useEffect, useMemo, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

import getStorageValue from "@utils/localStorage/getStorageValue";

export default function Cart({ open, setOpen }) {
	const [products, setProducts] = useState([]);
	const [delfee, setDelFee] = useState(50);
	const [subtotal, setSubtotal] = useState(0);
	const [total, setTotal] = useState(delfee + subtotal);

	// Initialize cart
	useEffect(() => {
		if (open) {
			let cart = getStorageValue("foodCart");
			setProducts(cart.data);
			setSubtotal(cart.total + subtotal);
			setTotal(cart.total + subtotal + delfee);
		} else {
			setTimeout(() => {
				setSubtotal(0);
				setTotal(0);
			}, 400);
		}
	}, [open]);

	// Delete item and update prices
	const deleteItem = (name) => {
		const index = products.findIndex((product) => product.menuItem.productName === name);
		products.splice(index, 1); // Delete item

		let temp = 0;
		products.forEach((product) => {
			temp += product.quantity * product.menuItem.productPrice;
		});

		setSubtotal(temp);
		setTotal(temp + delfee);
		localStorage.setItem("foodCart", JSON.stringify(products));
	};

	// Update quantity of item and update prices
	const updateTotal = async (value, name) => {
		const index = products.findIndex((product) => product.menuItem.productName === name);
		products[index].quantity = value; // Update quantity

		let temp = 0;
		products.forEach((product) => {
			temp += product.quantity * product.menuItem.productPrice;
		});

		setSubtotal(temp);
		setTotal(temp + delfee);
		localStorage.setItem("foodCart", JSON.stringify(products));
	};

	if (products) {
		return (
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
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

						<div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<div className="w-screen max-w-md">
									<div className="flex flex-col h-full overflow-y-scroll bg-white shadow-xl">
										<div className="flex-1 px-4 py-6 overflow-y-auto sm:px-6">
											<div className="flex items-start justify-between">
												<Dialog.Title className="text-lg font-medium text-gray-900">My Food Cart</Dialog.Title>
												<div className="flex items-center ml-3 h-7">
													<button type="button" className="p-2 -m-2 text-gray-400 hover:text-gray-500" onClick={() => setOpen(false)}>
														<span className="sr-only">Close panel</span>
														<XIcon className="w-6 h-6" aria-hidden="true" />
													</button>
												</div>
											</div>

											<div className="mt-8">
												<div className="flow-root">
													<ul role="list" className="-my-6 divide-y divide-gray-200">
														{products.map((product) => (
															<li key={product.id} className="flex py-6">
																<div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded-md">
																	<img
																		src={product.menuItem.productImagesCollection.items[0].url}
																		//   alt={product.imageAlt}
																		className="object-cover object-center w-full h-full"
																	/>
																</div>

																<div className="flex flex-col flex-1 ml-4">
																	<div>
																		<div className="flex justify-between text-base font-medium text-gray-900">
																			<h3>
																				<a href="#">{product.menuItem.productName}</a>
																			</h3>
																			<p className="ml-4">P {product.menuItem.productPrice * product.quantity}</p>
																		</div>
																		<p className="mt-1 text-sm text-gray-500">P {product.menuItem.productPrice}</p>
																	</div>
																	<div className="flex items-end justify-between flex-1 text-sm">
																		<p className="text-gray-500">
																			Quantity:
																			<input
																				className="mx-2 rounded-md input font-black-100 text-normal w-14 input-sm input-bordered focus:ring-2 focus:ring-blue-300"
																				type="number"
																				min="1"
																				step="1"
																				max="9999"
																				name={product.menuItem.productName}
																				value={product.quantity}
																				placeholder={product.quantity}
																				onLoad={(e) => setTotal(product.quantity)}
																				onChange={(e) => updateTotal(e.target.value, e.target.name)}
																			></input>
																			pc
																		</p>
																		<div className="flex">
																			<button
																				name={product.menuItem.productName}
																				type="button"
																				className="font-medium text-green-600 hover:text-green-500"
																				onClick={(e) => deleteItem(e.target.name)}
																			>
																				Remove
																			</button>
																		</div>
																	</div>
																</div>
															</li>
														))}
													</ul>
												</div>
											</div>
										</div>

										<div className="px-4 py-6 border-t border-gray-200 sm:px-6">
											<div className="flex justify-between text-base font-medium text-gray-900">
												<p>Subtotal</p>
												<p>P{subtotal}</p>
											</div>
											<div className="flex justify-between my-3 text-base text-gray-500 text-medium">
												<p>Delivery Fee</p>
												<p>P{delfee}</p>
											</div>
											<div className="flex justify-between text-base font-medium text-gray-900">
												<p>Total</p>
												<p>P{total}</p>
											</div>
											{/* <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p> */}
											<div className="mt-6">
												<a
													href="/checkout"
													className="flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
												>
													Proceed to Checkout
												</a>
											</div>
											<div className="flex justify-center mt-6 text-sm text-center text-gray-500">
												<p>
													or{" "}
													<a
														href="/menu"
														className="font-medium text-green-600 hover:text-green-500">
														Add more items<span aria-hidden="true"> &rarr;</span>
													</a>
												</p>
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
	} else {
		return (
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
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

						<div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<div className="w-screen max-w-md">
									<div className="flex flex-col h-full overflow-y-scroll bg-white shadow-xl">
										<div className="flex-1 px-4 py-6 overflow-y-auto sm:px-6">
											<div className="flex items-start justify-between">
												<Dialog.Title className="text-lg font-medium text-gray-900">My Food Cart</Dialog.Title>
												<div className="flex items-center ml-3 h-7">
													<button type="button" className="p-2 -m-2 text-gray-400 hover:text-gray-500" onClick={() => setOpen(false)}>
														<span className="sr-only">Close panel</span>
														<XIcon className="w-6 h-6" aria-hidden="true" />
													</button>
												</div>
											</div>

											<div className="mt-8">
												<div className="flow-root">
													<ul role="list" className="-my-6 divide-y divide-gray-200">
														ADD AN ITEM TO CART
													</ul>
												</div>
											</div>
										</div>

										<div className="px-4 py-6 border-t border-gray-200 sm:px-6">
											<div className="flex justify-between text-base font-medium text-gray-900">
												<p>Subtotal</p>
												<p>P{subtotal}</p>
											</div>
											<div className="flex justify-between my-3 text-base text-gray-500 text-medium">
												<p>Delivery Fee</p>
												<p>P{delfee}</p>
											</div>
											<div className="flex justify-between text-base font-medium text-gray-900">
												<p>Total</p>
												<p>P{total}</p>
											</div>
											{/* <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p> */}
											<div className="mt-6">
												<a
													href="/checkout"
													className="flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
												>
													Proceed to Checkout
												</a>
											</div>
											<div className="flex justify-center mt-6 text-sm text-center text-gray-500">
												<p>
													or{" "}
													<a
														href="/menu"
														className="font-medium text-green-600 hover:text-green-500">
														Add items<span aria-hidden="true"> &rarr;</span>
													</a>
												</p>
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
}
