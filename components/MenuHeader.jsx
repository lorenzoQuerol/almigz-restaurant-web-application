import Link from "next/link";

const MenuHeader = ({ openBranch, setOpenBranch, numProducts, setSearch }) => {
	return (
		<div className="flex items-center justify-center px-4 py-4 md:px-6 2xl:px-0 2xl:mx-auto 2xl:container">
			<div className="flex-col items-center justify-between w-full sm:flex-1">
				<div className="flex flex-col items-start justify-start">
					<p className="text-sm leading-none text-gray-500">
						<Link href="/">Home</Link> / Menu
					</p>

					<div className="flex flex-row items-center justify-start w-full mt-2">
						<div className="text-3xl font-semibold leading-normal text-gray-800">Menu</div>
						<div className="mx-5 mt-2 text-base leading-4 text-gray-500">({numProducts} products)</div>
						<div className="w-1/3 md:w-1/3 lg:w-1/5">
							<button
								onClick={() => setOpenBranch(!openBranch)}
								className="items-center justify-center w-full px-4 py-2 mx-5 text-xs text-sm font-medium text-white transition-colors bg-green-700 border border-transparent rounded sm:text-sm hover:bg-green-600"
							>
								Choose Branch
							</button>
						</div>
					</div>
				</div>

				{/* ANCHOR Mobile search */}
				<div className="block pt-2 mx-auto text-gray-500 sm:hidden">
					<input
						onChange={(e) => setSearch(e.target.value)}
						className="w-full h-10 px-5 pr-16 text-sm transition-colors bg-white border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
						type="text"
						placeholder="Search..."
					/>
				</div>
			</div>

			{/* ANCHOR Desktop search */}
			<div className="hidden mx-auto text-gray-500 sm:block">
				<input
					onChange={(e) => setSearch(e.target.value)}
					className="h-10 px-5 pr-16 text-sm transition-colors bg-white border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
					type="text"
					placeholder="Search..."
				/>
			</div>
		</div>
	);
};

export default MenuHeader;
