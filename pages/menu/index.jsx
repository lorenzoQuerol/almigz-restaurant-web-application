import useSWR from "swr";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import BranchDialog from "@components/BranchDialog";
import CategoryBar from "@components/CategoryBar";
import MenuHeader from "@components/MenuHeader";
import Loading from "@components/Loading";

import getStorageValue from "@utils/localStorage/getStorageValue";
import removeStorageValue from "@utils/localStorage/removeStorageValue";

const fetcher = (url, branch) => fetch(`${url}?branch=${branch}`).then((res) => res.json());

export default function Menu() {
	// ANCHOR Page variables
	const [branch, setBranch] = useState(() => {
		return getStorageValue("branch");
	});
	const [openBranch, setOpenBranch] = useState(true);
	const { data, error } = useSWR([`/api/foodItems`, branch], fetcher);
	const [foodItems, setFoodItems] = useState([]);
	const [activeCategory, setActiveCategory] = useState("Show all");
	const [search, setSearch] = useState("");

	const handleBranchDialog = (value) => {
		setOpenBranch(!openBranch);
		setBranch(value);
		removeStorageValue("foodCart");
	};

	useEffect(() => {
		if (data) setFoodItems(data.foodItems);
		if (branch) setOpenBranch(branch ? false : true);
	}, [data]);

	let filtered = foodItems.filter((foodItem) => foodItem.category === activeCategory);
	if (activeCategory == "Show all") filtered = foodItems;

	return (
		<>
			<BranchDialog openBranch={openBranch} setOpenBranch={setOpenBranch} handleBranchDialog={handleBranchDialog} />
			<div className="text-gray-800 font-rale">
				{/* Remove py-8 */}
				<div className="container justify-center py-6 mx-auto">
					{/* ANCHOR Menu header and search bar */}
					<MenuHeader openBranch={openBranch} setOpenBranch={setOpenBranch} numProducts={filtered.length} setSearch={setSearch} />

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
																<h3 className="text-lg font-semibold">
																	{item.productPrice ? `₱${item.productPrice}` : `Starting at ₱${item.productPrices?.[0]}`}
																</h3>
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
}

Menu.layout = "consumer";
