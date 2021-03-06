import { Fragment, useState, useEffect, useMemo, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import getStorageValue from "@utils/localStorage/getStorageValue";
import removeStorageValue from "@utils/localStorage/removeStorageValue";

const Cart = ({ open, handleOpen }) => {
	const [cart, setCart] = useState(undefined); // WHOLE CART
	const [products, setProducts] = useState([]); // FOOD ITEMS ARRAY

	const [total, setTotal] = useState();

	// Initialize cart
	useEffect(() => {
		if (open) {
			let data = getStorageValue("foodCart");
			if (data) {
				setCart(data); // Contains food items and total price
				setProducts(data.products); // Contains food items only (w/o total price)
				setTotal(data.total);
			}
		} else {
			setTimeout(() => {
				setTotal(0);
			}, 400);
		}
	}, [open]);

	// Delete item and update prices
	const deleteItem = (name, category) => {
		const index = products.findIndex((product) => product.menuItem.productName === name && product.menuItem.category === category);
		products.splice(index, 1); // Delete item

		let temp = 0;
		products.forEach((product) => {
			temp += product.quantity * product.menuItem.productPrice;
		});

		setTotal(temp);

		cart.products = products;
		cart.total = temp;
		window.localStorage.setItem("foodCart", JSON.stringify(cart));

		if (products.length === 0) {
			setCart(null);
			setProducts(null);
			removeStorageValue("foodCart");
		}
	};

	// Update quantity of item and update prices
	const updateTotal = (value, name, category) => {
		const index = products.findIndex((product) => product.menuItem.productName === name && product.menuItem.category === category);
		products[index].quantity = value; // Update quantity

		let temp = 0;
		products.forEach((product) => {
			temp += product.quantity * product.menuItem.productPrice;
		});

		setTotal(temp);

		cart.products = products;
		cart.total = temp;
		window.localStorage.setItem("foodCart", JSON.stringify(cart));
	};

	if (cart && products.length !== 0) {
		return (
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 z-20 overflow-hidden" onClose={handleOpen}>
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
												<Dialog.Title className="text-lg font-medium text-gray-800">My Food Cart</Dialog.Title>
												<div className="flex items-center ml-3 h-7">
													<button type="button" className="p-2 -m-2 text-gray-400 hover:text-gray-500" onClick={handleOpen}>
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
																<div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded">
																	<img
																		src={product.menuItem.productImagesCollection.items[0].url}
																		//   alt={product.imageAlt}
																		className="object-cover object-center w-full h-full"
																	/>
																</div>

																<div className="flex flex-col flex-1 ml-4">
																	<div>
																		<div className="flex justify-between text-base font-medium text-gray-800">
																			<h3>
																				<a href="#">{product.menuItem.productName}</a>
																			</h3>
																			<p className="w-1/4 ml-4 text-right">??? {product.menuItem.productPrice * product.quantity}</p>
																		</div>
																		<p className="mt-1 text-sm text-gray-500">??? {product.menuItem.productPrice}</p>
																	</div>
																	<div className="flex items-end justify-between flex-1 text-sm">
																		<p className="text-gray-500">
																			Quantity:
																			<input
																				className="mx-2 rounded input font-black-100 text-normal w-14 input-sm input-bordered focus:ring-2 focus:ring-blue-300"
																				type="number"
																				min="1"
																				step="1"
																				max="9999"
																				name={product.menuItem.productName}
																				value={product.quantity}
																				placeholder={product.quantity}
																				onLoad={(e) => setTotal(product.quantity)}
																				onChange={(e) => updateTotal(e.target.value, e.target.name, product.menuItem.category)}
																			></input>
																			pc
																		</p>
																		<div className="flex">
																			<button
																				name={product.menuItem.productName}
																				type="button"
																				className="font-medium text-green-700 transition-colors hover:text-green-600"
																				onClick={(e) => deleteItem(e.target.name, product.menuItem.category)}
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
											<div className="flex justify-between text-base font-medium text-gray-800">
												<p>Total</p>
												<p>???{total}</p>
											</div>
											{/* <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p> */}
											<div className="mt-6">
												<a
													href="/checkout"
													className="flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-colors bg-green-700 border rounded shadow-sm hover:bg-green-600"
												>
													Proceed to Checkout
												</a>
											</div>
											<div className="flex justify-center mt-6 text-sm text-center">
												<p>
													or{" "}
													<Link href="/menu" onClick={handleOpen}>
														<a className="font-medium text-green-700 transition-colors hover:text-green-600">
															Add more items<span aria-hidden="true"> &rarr;</span>
														</a>
													</Link>
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
				<Dialog as="div" className="fixed inset-0 z-20 overflow-hidden" onClose={handleOpen}>
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
													<button type="button" className="p-2 -m-2 text-gray-400 hover:text-gray-500" onClick={handleOpen}>
														<span className="sr-only">Close panel</span>
														<XIcon className="w-6 h-6" aria-hidden="true" />
													</button>
												</div>
											</div>

											<div className="mt-8">
												<div className="flow-root">
													<ul role="list" className="-my-6 divide-gray-200">
														<div className="mt-5">
															<li className="flex justify-center">There are no items in your cart right now!</li>
															<Link href="/menu">
																<a onClick={handleOpen}>
																	<li className="flex justify-center font-semibold text-green-700 underline transition-colors duration-200 cursor-pointer hover:text-green-600 decoration-dotted underline-offset-2">
																		Go to Our Menu!
																	</li>
																</a>
															</Link>
														</div>
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

export default Cart;
