import Link from "next/link";

const MenuHeader = ({ numProducts, setSearch }) => {
	return (
		<div className="flex items-center justify-center px-4 py-4 md:px-6 2xl:px-0 2xl:mx-auto 2xl:container">
			<div className="flex-col items-center justify-between w-full sm:flex-1">
				<div className="flex flex-col items-start justify-start">
					<p className="text-sm leading-none text-gray-600">
						<Link href="/">Home</Link> / Menu
					</p>
					<div className="flex flex-row items-center justify-end mt-2 space-x-3">
						<p className="text-3xl font-semibold leading-normal text-gray-800">Menu</p>
						<p className="mt-2 text-base leading-4 text-gray-600">({numProducts} products)</p>
					</div>
				</div>

				{/* ANCHOR Mobile search */}
				<div className="block pt-2 mx-auto text-gray-600 sm:hidden">
					<input
						onChange={(e) => setSearch(e.target.value)}
						className="w-full h-10 px-5 pr-16 text-sm transition-colors bg-white border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
						type="text"
						placeholder="Search..."
					/>
				</div>
			</div>

			{/* ANCHOR Desktop search */}
			<div className="hidden pt-2 mx-auto text-gray-600 sm:block">
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
