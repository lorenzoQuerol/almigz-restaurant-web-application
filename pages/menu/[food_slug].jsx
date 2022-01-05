import { data } from "autoprefixer";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import pushToCart from "@utils/foodCart/pushToCart";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function FoodItemPage() {
	const router = useRouter();
	const { data, error } = useSWR(`/api/foodItems/${router.query.food_slug}`, fetcher);
	const { data: session, status } = useSession();
	const [quantity, setquantity] = useState(1);
	const [total, setTotal] = useState("");

	if (error) return <div>failed to load</div>;
	if (!data) return <div>loading</div>;

	const updateTotal = async (num) => {
		num = Number(num);
		if (Number.isInteger(num) && num > 0 && num < 10000) {
			setTotal(data.data.productPrice * num);
			setquantity(num);
		}
	};

	const addToCart = async (event) => {
		event.preventDefault();

		if (session) {
			const item = {
				menuItem: data.data,
				quantity: quantity,
			};
			pushToCart(item);
			router.replace(
				{
					pathname: "/cart",
					// query: {item: JSON.stringify(item)},
				},
				`/menu/${router.query.food_slug}`,
				{ shallow: true }
			);
		} else {
			alert("Please login before adding to cart.");
			router.push("/auth/signIn");
		}
	};

	//food item does not exist
	if (!data.data) {
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
	}

	//render food item page
	else {
		var pic = data.data.productImagesCollection.items[0].url;

		return (
			<>
				<div onLoad={(e) => setTotal(data.data.productPrice)} className="flex-col w-1/2 p-10 text-center rounded-md shadow-2xl shadow-yellow-400">
					<h1 className="text-3xl font-bold text-black font-rale">{data.data.productName}</h1>
					<h1>{data.data.category}</h1>
					<Image src={pic} layout="intrinsic" className="bg-gray-100 shadow-2xl shadow-black-400" width="300" height="200" />
					<h1 className="mt-8">{data.data.productDescription}</h1>
					<h1 className="pb-3 mt-12 text-2xl font-bold text-green-700">P {total}</h1>
					<form onSubmit={addToCart} className="flex-col">
						<input
							className="w-24 p-5 pr-2 mr-2 text-xl rounded-md input font-black-100 input-sm input-bordered focus:ring-2 focus:ring-blue-300"
							type="number"
							min="1"
							step="1"
							max="9999"
							placeholder="1"
							onLoad={(e) => setTotal(data.data.productPrice)}
							onChange={(e) => updateTotal(e.target.value)}
						></input>
						pc
						<button className="p-4 m-5 font-normal text-white bg-green-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-green-300">Add to Cart</button>
					</form>
				</div>
			</>
		);
	}
}
