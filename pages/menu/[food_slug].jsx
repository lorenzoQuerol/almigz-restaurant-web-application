import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";

import pushToCart from "@utils/foodCart/pushToCart";
import Cart from "@components/Cart";
import Loading from "@components/Loading";

const fetcher = (url) => fetch(url).then((res) => res.json());
const order = ["Single", "Small", "Medium", "Large"];

export default function FoodItem() {
	const router = useRouter();
	const { data, error } = useSWR(`/api/foodItems/${router.query.food_slug}`, fetcher);
	const { data: session, status } = useSession();
	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			count: 1,
			size: "Single",
		},
	});

	// ANCHOR Page variables
	const [open, setOpen] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [foodItem, setFoodItem] = useState({});
	const [images, setImages] = useState([]);
	const [image, setImage] = useState("");

	useEffect(() => {
		if (session) if (session.user.isAdmin) setIsAdmin(true);
		if (data) setFoodItem(data.foodItem);
		if (foodItem) {
			setImages(foodItem.productImagesCollection);
		}
		if (images) setImage(images.items);
	}, [session, data, foodItem, images]);

	// Add to cart
	const addToCart = async (quantity) => {
		if (session) {
			let item;
			if (foodItem.productPrices) {
				let menuItem = Object.assign({}, foodItem);
				menuItem.productPrice = menuItem.productPrices[menuItem.sizes.indexOf(watch("size"))];
				menuItem.productName = `${menuItem.productName} - ${watch("size")}`;
				delete menuItem.productPrices;
				delete menuItem.sizes;

				item = {
					menuItem: menuItem,
					quantity: quantity.count,
				};
			} else {
				item = {
					menuItem: data.foodItem,
					quantity: quantity.count,
				};
			}

			pushToCart(item);
			handleOpen();
		} else {
			router.replace("/signin");
		}
	};

	const handleOpen = () => {
		setOpen(!open);
	};

	return (
		<div className="px-4 2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 ">
			{!image ? (
				<Loading />
			) : (
				<div>
					<Cart open={open} handleOpen={handleOpen} />
					<div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
						{/* ANCHOR Description */}
						<div className="items-center w-full sm:w-96 md:w-8/12 lg:w-6/12">
							<p className="text-base font-normal leading-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800">
								<Link href="/">Home</Link> / <Link href="/menu">Menu</Link> / {foodItem.productName}
							</p>
							<h2 className="mt-4 text-3xl font-semibold leading-7 text-gray-800 lg:text-4xl lg:leading-9">{foodItem.productName}</h2>

							<p className="text-base font-normal leading-6 text-gray-800 mt-7">{foodItem.productDescription}</p>
							<p className="mt-6 text-xl font-semibold leading-5 text-gray-800 lg:text-2xl lg:leading-6">
								₱
								{foodItem.productPrice
									? foodItem.productPrice * Number(watch("count"))
									: foodItem.productPrices[foodItem.sizes.indexOf(watch("size"))] * Number(watch("count"))}
							</p>
							<form onSubmit={handleSubmit(addToCart)}>
								<div className="mt-10 space-y-2 lg:mt-11">
									<div className="flex flex-row justify-between">
										<p className="self-center text-base font-medium leading-4 text-gray-800">Select quantity</p>
										<div className="flex">
											<span
												onClick={() => setValue("count", Math.max(1, Number(getValues("count")) - 1))}
												className="flex items-center justify-center pb-1 border border-r-0 border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-7 h-7"
											>
												-
											</span>
											<input
												className="h-full pb-1 text-center border border-gray-300 w-14 focus:border-1 focus:border-green-700 focus:outline-none"
												type="text"
												{...register("count", { required: true, min: "1", max: "9999" })}
											/>
											<span
												onClick={() => setValue("count", Math.max(1, Number(getValues("count")) + 1))} // Math.max(1, Number(getValues("count")) + 1))
												className="flex items-center justify-center pb-1 border border-l-0 border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-7 h-7 "
											>
												+
											</span>
										</div>
									</div>
									{errors.count?.type === "required" && <p className="text-sm font-medium leading-4 text-red-700">Quantity is required</p>}
									{errors.count?.type === "min" && <p className="text-sm font-medium leading-4 text-red-700">Order must be more than 0</p>}
									{errors.count?.type === "max" && <p className="text-sm font-medium leading-4 text-red-700">Order must be less than 10000</p>}

									{foodItem.sizes && (
										<div className="flex flex-row justify-between">
											<p className="self-center text-base font-medium leading-4 text-gray-800">Select Size</p>
											<div className="relative">
												<select
													className="py-1 pl-3 pr-10 text-base border border-gray-300 appearance-none focus:outline-none focus:border-green-700"
													{...register("size")}
												>
													{foodItem.sizes.map((size, index) => {
														return <option value={size}>{size}</option>;
													})}
												</select>
												<span className="absolute top-0 right-0 flex items-center justify-center w-10 h-full text-center text-gray-600 pointer-events-none">
													<svg
														fill="none"
														stroke="currentColor"
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														className="w-4 h-4"
														viewBox="0 0 24 24"
													>
														<path d="M6 9l6 6 6-6"></path>
													</svg>
												</span>
											</div>
										</div>
									)}
								</div>
								<button
									type="submit"
									className="w-full py-5 mt-6 text-base font-medium leading-4 text-white transition-colors bg-green-700 rounded focus:outline-none focus:ring-2 hover:bg-green-600 focus:ring-offset-2 focus:ring-gray-800 lg:mt-12"
								>
									Add to cart
								</button>
							</form>
						</div>

						{/* ANCHOR Image */}
						<div className="flex flex-col w-full sm:w-96 md:w-8/12 lg:w-6/12 lg:justify-center lg:flex-row">
							<div className="flex items-center justify-center w-full bg-zinc-100 lg:w-full xl:w-8/12">
								<Image width={3300} height={2550} src={image[0].url} />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

FoodItem.layout = "consumer";
