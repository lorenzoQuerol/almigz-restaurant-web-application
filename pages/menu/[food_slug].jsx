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

export default function FoodItemPage() {
	const router = useRouter();
	const { data, error } = useSWR(`/api/foodItems/${router.query.food_slug}`, fetcher);
	const { data: session, status } = useSession();
	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			count: 1,
		},
	});

	// Page variables
	const [quantity, setquantity] = useState(1);
	const [total, setTotal] = useState("");
	const [open, setOpen] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [count, setCount] = useState(1);

	useEffect(() => {
		if (session) {
			if (session.user.isAdmin) setIsAdmin(true);
		}
	}, [session]);

	const updateTotal = (num) => {
		if (Number.isInteger(num) && num > 0 && num < 10000) {
			setTotal(data.foodItem.productPrice * num);
			setquantity(num);
		} else {
			setTotal(data.foodItem.productPrice);
			setquantity(1);
		}
	};

	// Add to cart
	const addToCart = async (quantity) => {
		if (session) {
			const item = {
				menuItem: data.foodItem,
				quantity: quantity.count,
			};

			pushToCart(item);
			handleOpen();
		} else {
			router.replace("/signin");
		}
	};

	const handleOpen = () => {
		setOpen(!open);
	};

	if (!data) return <Loading />;

	if (!data.foodItem) {
		return (
			<div className="flex-col text-center self-top">
				<h1 className="m-4 italic font-light text-gray-500">Menu item not found. </h1>
				<Link href="/menu">
					<a className="p-2 m-2 text-xl font-semibold text-yellow-600 border-2 border-yellow-500 font-rale rounded-btn hover:text-white hover:bg-yellow-500 hover:border-none">
						VIEW MENU
					</a>
				</Link>
			</div>
		);
	} else {
		const pic = data.foodItem.productImagesCollection.items[0].url;

		return (
			<div className="px-4 2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 ">
				<Cart open={open} handleOpen={handleOpen} />
				<div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
					{/* ANCHOR Description */}
					<div className="items-center w-full sm:w-96 md:w-8/12 lg:w-6/12">
						<p className="text-base font-normal leading-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800">
							<Link href="/">Home</Link> / <Link href="/menu">Menu</Link> / {data.foodItem.productName}
						</p>
						<h2 className="mt-4 text-3xl font-semibold leading-7 text-gray-800 lg:text-4xl lg:leading-9">{data.foodItem.productName}</h2>

						<p className="text-base font-normal leading-6 text-gray-800 mt-7">{data.foodItem.productDescription}</p>
						<p className="mt-6 text-xl font-semibold leading-5 text-gray-800 lg:text-2xl lg:leading-6">₱{data.foodItem.productPrice}</p>
						<form onSubmit={handleSubmit(addToCart)}>
							<div className="mt-10 lg:mt-11">
								<div className="flex flex-row justify-between">
									<p className="self-center text-base font-medium leading-4 text-gray-800">Select quantity</p>
									<div className="flex">
										<span
											onClick={() => setValue("count", Number(getValues("count")) - 1)}
											className="flex items-center justify-center pb-1 border border-r-0 border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-7 h-7"
										>
											-
										</span>
										<input
											className="h-full pb-1 text-center border border-gray-300 w-14 focus:border-2 focus:border-green-700 focus:outline-none"
											type="text"
											{...register("count", { required: true, min: "1", max: "9999" })}
										/>
										<span
											onClick={() => setValue("count", Number(getValues("count")) + 1)}
											className="flex items-center justify-center pb-1 border border-l-0 border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-7 h-7 "
										>
											+
										</span>
									</div>
								</div>
								{errors.count?.type === "required" && <p className="text-sm font-medium leading-4 text-red-700">Quantity is required</p>}
								{errors.count?.type === "min" && <p className="text-sm font-medium leading-4 text-red-700">Order must be more than 0</p>}
								{errors.count?.type === "max" && <p className="text-sm font-medium leading-4 text-red-700">Order must be less than 10000</p>}
							</div>
							<button
								type="submit"
								className="w-full py-5 mt-6 text-base font-medium leading-4 text-white transition-colors bg-green-700 focus:outline-none focus:ring-2 hover:bg-green-600 focus:ring-offset-2 focus:ring-gray-800 lg:mt-12"
							>
								Add to cart
							</button>
						</form>
					</div>

					{/* ANCHOR Image */}
					<div className="flex flex-col w-full sm:w-96 md:w-8/12 lg:w-6/12 lg:justify-center lg:flex-row">
						<div className="flex items-center justify-center w-full bg-zinc-100 lg:w-full xl:w-8/12">
							<Image width={3300} height={2550} src={pic} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
