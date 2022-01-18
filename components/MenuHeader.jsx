import { useState } from "react";

const MenuHeader = ({ activeCategory, setActiveCategory }) => {
	const categories = ["Show all", "Binalot", "Pancit In Boxes", "House Specialties", "Desserts & Refreshments"];

	return (
		<header className="text-slate-900 body-font">
			<div className="container flex flex-col flex-wrap items-center p-3 mx-auto md:flex-row">
				<nav className="flex flex-wrap items-center justify-center text-base md:mr-auto md:border-gray-400">
					{categories.map((category) => {
						if (category === activeCategory) {
							return <a className="px-3 py-2 mx-3 my-2 font-semibold text-white transition-colors duration-100 bg-green-700 rounded-md cursor-pointer">{category}</a>;
						} else {
							return (
								<a
									className="px-3 py-2 mx-3 my-2 transition-colors duration-200 rounded-md cursor-pointer hover:text-white hover:bg-green-700"
									onClick={() => setActiveCategory(category)}
								>
									{category}
								</a>
							);
						}
					})}
				</nav>
			</div>
		</header>
	);
};

export default MenuHeader;
