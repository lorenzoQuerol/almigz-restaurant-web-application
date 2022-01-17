import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";

import pushToCart from "@utils/foodCart/pushToCart";
import Cart from "@components/Cart";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function FoodItemPage() {
	const router = useRouter();
	const { data, error } = useSWR(`/api/foodItems/${router.query.food_slug}`, fetcher);
	const { data: session, status } = useSession();

	// Page variables
	const [quantity, setquantity] = useState(1);
	const [total, setTotal] = useState("");
	const [open, setOpen] = useState(false);

	const updateTotal = async (num) => {
		num = Number(num);
		if (Number.isInteger(num) && num > 0 && num < 10000) {
			setTotal(data.data.productPrice * num);
			setquantity(num);
		} else {
			setTotal(data.data.productPrice);
			setquantity(1);
		}
	};

	// Add to cart
	const addToCart = async (event) => {
		event.preventDefault();

		if (session) {
			const item = {
				menuItem: data.data,
				quantity: quantity,
			};

			pushToCart(item);
			handleOpen();
		} else {
			alert("Please login before adding to cart.");
			router.push("/auth/signIn");
		}
	};

	const handleOpen = () => {
		setOpen(!open);
	};

	if (!data) return <h1>Loading...</h1>;

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
	} else {
		const pic = data.data.productImagesCollection.items[0].url;

		return (
			<div className="container px-5 py-8 mx-auto">
				<div onLoad={(e) => setTotal(data.data.productPrice)} className="overflow-hidden text-gray-600 body-font font-rale">
					<div className="mx-auto mb-8 text-md breadcrumbs xl:w-4/5">
						<ul>
							<li>
								<Link href="/menu">
									<a>Menu</a>
								</Link>
							</li>
							<li>
								<Link href={`/menu/${router.query.food_slug}`}>
									<a>{data.data.productName}</a>
								</Link>
							</li>
						</ul>
					</div>
					<div className="flex flex-wrap justify-center mx-auto xl:w-4/5">
						<Image className="object-cover object-center w-full h-64 rounded lg:w-1/2 lg:h-auto" width={400} height={400} layout="fixed" src={pic} />

						<div className="w-full mt-6 lg:w-1/2 lg:pl-10 lg:py-6 lg:mt-0">
							<h2 className="text-sm tracking-widest text-gray-500 title-font">{data.data.category.toUpperCase()}</h2>
							<h1 className="mb-1 text-3xl font-semibold text-gray-900 title-font">{data.data.productName}</h1>
							<div className="flex mb-4"></div>
							<p className="leading-relaxed">{data.data.productDescription}</p>
							<form onSubmit={addToCart}>
								<div className="flex items-center pb-5 mt-6 mb-5 border-b-2 border-gray-100">
									<div className="flex items-center">
										<span className="mr-3">Quantity:</span>
										<div className="relative">
											<input
												className="py-2 pl-3 pr-2 text-base border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-700"
												type="number"
												min="1"
												step="1"
												max="9999"
												placeholder="1"
												onLoad={(e) => setTotal(data.data.productPrice)}
												onChange={(e) => updateTotal(e.target.value)}
											></input>
										</div>
									</div>
								</div>
								<div className="flex">
									<span className="text-2xl font-medium text-gray-900 title-font">₱{total}</span>
									<button className="flex px-6 py-2 ml-auto font-semibold text-white transition-colors bg-green-700 border-0 rounded focus:outline-none hover:bg-green-600">
										Add to Cart
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<Cart open={open} handleOpen={handleOpen} />
			</div>
		);
	}
}
