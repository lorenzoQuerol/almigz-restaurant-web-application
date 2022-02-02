import useSWR from "swr";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import CategoryBar from "@components/CategoryBar";
import MenuHeader from "@components/MenuHeader";
import Loading from "@components/Loading";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MenuPage() {
	// ANCHOR Food item variables
	const { data, error } = useSWR("/api/foodItems", fetcher);
	const [foodItems, setFoodItems] = useState([]);
	const [activeCategory, setActiveCategory] = useState("Show all");
	const [search, setSearch] = useState("");

	useEffect(() => {
		if (data) setFoodItems(data.foodItems);
	}, [data]);

	let filtered = foodItems.filter((foodItem) => foodItem.category === activeCategory);
	if (filtered.length === 0) filtered = foodItems;

	return (
		<>
			<div className="font-rale text-slate-800">
				{/* Remove py-8 */}
				<div className="container justify-center py-6 mx-auto">
					{/* ANCHOR Menu header and search bar */}
					<MenuHeader numProducts={filtered.length} setSearch={setSearch} />

					{/* ANCHOR Category bar */}
					<CategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

					{!data ? (
						<div className="mt-16">
							<Loading />
						</div>
					) : (
						<div>
							{/* SECTION Food items */}
							<div className="flex flex-wrap justify-center">
								{filtered
									.filter((value) => {
										if (value === "") return foodItems;
										else if (value.productName.toLowerCase().includes(search.toLowerCase())) {
											return value;
										}
									})
									.map((item, index) => {
										return (
											<Link href={item.available ? `/menu/${encodeURIComponent(item.slug)}` : ""}>
												<div className="mx-2 my-5 mb-8 shadow cursor-pointer w-72 lg:mb-0">
													<div className="bg-zinc-100">
														{item.productImagesCollection.items[0] && (
															<Image width={3300} height={2550} layout="responsive" src={item.productImagesCollection.items[0].url} />
														)}
													</div>
													<div className="bg-white">
														<div className="flex items-center justify-between px-4 pt-4">
															<div></div>
															<div className="bg-green-700 py-1.5 px-6 rounded-full">
																<p className="text-xs font-medium text-white">{item.category}</p>
															</div>
														</div>
														<div className="p-4">
															<div className="flex items-center">
																<h2 className="text-lg font-semibold">{item.productName}</h2>
															</div>
															<p className="mt-2 text-xs text-gray-600 truncate">{item.productDescription}</p>

															<div className="flex items-center justify-between py-4">
																{/* <h2 className="text-xs font-semibold text-indigo-700">Bay Area, San Francisco</h2> */}
																<h3 className="text-xl font-semibold text-gray-800">₱{item.productPrice}</h3>
															</div>
														</div>
													</div>
												</div>
											</Link>
										);
									})}
							</div>

							{/* !SECTION  */}
						</div>
					)}
				</div>
			</div>
		</>
	);

	return (
		<div className="overflow-hidden text-gray-900 font-rale">
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
