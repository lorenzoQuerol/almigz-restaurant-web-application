const CategoryBar = ({ activeCategory, setActiveCategory }) => {
	const categories = ["Show all", "Binalot", "Pancit In Boxes", "House Specialties", "Drinks & Desserts", "Barkada Treats", "Others"];

	return (
		<div>
			{/* ANCHOR Mobile */}
			<div className="relative w-11/12 mx-auto bg-white rounded sm:hidden">
				<div className="absolute inset-0 z-0 w-6 h-6 m-auto mr-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="icon icon-tabler icon-tabler-selector"
						width={24}
						height={24}
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="#A0AEC0"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<polyline points="8 9 12 5 16 9" />
						<polyline points="16 15 12 19 8 15" />
					</svg>
				</div>
				<select
					onChange={(e) => setActiveCategory(e.target.value)}
					aria-label="Selected tab"
					className="z-10 block w-full px-2 py-1 font-semibold transition-colors bg-transparent border border-gray-300 rounded appearance-none focus:border-1 focus:border-green-700 focus:outline-none"
				>
					{categories.map((item, index) => {
						return <option className="text-sm">{item}</option>;
					})}
				</select>
			</div>

			{/* ANCHOR Desktop */}
			<div className="flex-wrap justify-center hidden py-1 bg-white rounded shadow sm:mx-5 lg:justify-between sm:block">
				<div className="h-12 px-5 xl:w-full xl:mx-0 -b">
					<ul className="flex items-center h-full">
						{categories.map((item, index) => {
							return (
								<li
									onClick={() => setActiveCategory(item)}
									className={
										activeCategory == item
											? "text-xs lg:text-sm transition-all duration-200 text-white py-2 px-3 bg-green-700 rounded cursor-default mx-3 lg:mr-8 font-medium"
											: "text-xs lg:text-sm transition-all duration-200 py-2 mx-1 lg:mr-8 px-1 font-medium hover:font-medium hover:text-green-700 cursor-pointer"
									}
								>
									{item}
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default CategoryBar;
