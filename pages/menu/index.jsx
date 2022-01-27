import useSWR from "swr";
import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";

import MenuHeader from "@components/MenuHeader";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MenuPage() {
	const { data, error } = useSWR("/api/foodItems", fetcher);
	const [foodItems, setFoodItems] = useState([]);
	const [activeCategory, setActiveCategory] = useState("Show all");

	useEffect(() => {
		if (data) setFoodItems(data.foodItems);
	}, [data]);

	let filtered = foodItems.filter((foodItem) => foodItem.category === activeCategory);
	if (filtered.length === 0) filtered = foodItems;

	return (
		<div className="text-gray-900 font-rale">
			<MenuHeader activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
			<div className="container px-5 py-1 mx-auto">
				<div className="h-1 mb-6 overflow-hidden bg-gray-200 rounded">
					<div className="w-24 h-full bg-green-700"></div>
				</div>
				<div className="flex flex-wrap -m-4">
					{filtered.map((foodItem) => {
						return (
							<Link href={foodItem.available ? `/menu/${encodeURIComponent(foodItem.slug)}` : ""}>
								<div
									className={`${foodItem.available ? "" : "grayscale"} w-full p-4 transition-transform cursor-pointer hover:scale-105 lg:w-1/4 md:w-1/2`}
									key={foodItem.slug}
								>
									<div className="pb-2 rounded bg-gray-50 drop-shadow-md">
										<a className="relative block overflow-hidden rounded-t">
											{foodItem.productImagesCollection.items[0] && (
												<Image width={500} height={300} layout="responsive" src={foodItem.productImagesCollection.items[0].url} />
											)}
										</a>
										<div className="mt-3 ml-2">
											<h3 className="mb-1 text-xs font-bold tracking-widest text-green-700">{foodItem.category}</h3>
											<h2 className="text-sm font-semibold">
												{foodItem.productName}
												{foodItem.available ? "" : <a className="self-center ml-2 text-xs">UNAVAILABLE</a>}
											</h2>
											<p className="mt-1">₱{foodItem.productPrice}</p>
										</div>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
