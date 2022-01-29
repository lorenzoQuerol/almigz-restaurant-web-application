const Dashboard = ({ session }) => {
	return (
		<div className="w-full m-10">
			{/* Greeting */}
			<div className="mb-5 text-4xl font-extrabold">
				<a className="text-green-700">Welcome,</a> {session.user.name}
			</div>

			<div className="flex space-x-4">
				{/* Manage transactions */}
				<div className="w-1/5 rounded-md drop-shadow-md card bg-zinc-100">
					<div className="card-body">
						<div className="text-xl font-bold card-title">Manage Transactions</div>

						<div className="justify-end card-actions">
							<button className="btn btn-primary">
								Click here
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 ml-2 stroke-current">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Manage members */}
				<div className="w-1/5 rounded-md drop-shadow-md card bg-zinc-100">
					<div className="card-body">
						<div className="text-xl font-bold card-title">Manage Members</div>

						<div className="justify-end card-actions">
							<button className="btn btn-primary">
								Click here
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 ml-2 stroke-current">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Manage items */}
				<div className="w-1/5 rounded-md drop-shadow-md card bg-zinc-100">
					<div className="card-body">
						<div className="h-full text-xl font-bold card-title">Manage Items</div>

						<div className="justify-end card-actions">
							<button className="btn btn-primary">
								Click here
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 ml-2 stroke-current">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Summary */}
				<div className="w-1/5 rounded-md drop-shadow-md card bg-zinc-100">
					<div className="card-body">
						<div className="h-full text-xl font-bold card-title">Summary</div>

						<div className="justify-end card-actions">
							<button className="btn btn-primary">
								Click here
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 ml-2 stroke-current">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Dashboard;
