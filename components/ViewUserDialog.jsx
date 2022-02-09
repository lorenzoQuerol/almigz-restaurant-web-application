import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";
import axios from "axios";

const ViewUserDialog = ({ user, refetch, openViewUser, setOpenViewUser }) => {
	const [toggleAdmin, setToggleAdmin] = useState(user.isAdmin);
	const handleToggleAdmin = () => {
		setToggleAdmin(!toggleAdmin);
	};

	useEffect(() => {
		setToggleAdmin(user.isAdmin);
	}, [user]);

	const handleAdminChange = async () => {
		if (toggleAdmin === user.isAdmin) {
			setOpenViewUser(false);
		} else {
			user.isAdmin = toggleAdmin;
			const response = await axios.put(`/api/users/${user.email}`, user);
			if (response.status < 300) refetch();

			setOpenViewUser(false);
		}
	};

	return (
		<>
			<Transition appear show={openViewUser} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto text-gray-800 font-rale" onClose={handleAdminChange}>
					<div className="min-h-screen px-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-200"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Dialog.Overlay className="fixed inset-0 bg-gray-800 opacity-40" />
						</Transition.Child>

						{/* This element is to trick the browser into centering the modal contents. */}
						<span className="inline-block h-screen align-middle" aria-hidden="true">
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
								<Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-800">
									User Details
								</Dialog.Title>
								<div className="mt-2">
									<div className="font-semibold">Full Name</div>
									<div className="pb-2 mb-2 border-b-2">
										{user.firstName} {user.lastName}
									</div>
									<div className="font-semibold">Email</div>
									<div className="pb-2 mb-2 border-b-2">{user.email}</div>
									<div className="font-semibold">Address</div>
									<div className="pb-2 mb-2 border-b-2">{user.address}</div>
									<div className="font-semibold">Contact Numbers</div>
									<div>{user.contact1}</div>
									<div>{user.contact2}</div>
								</div>

								<div className="flex justify-end mt-4 space-x-4">
									<Switch.Group>
										<Switch.Label className="self-center w-full text-xs font-bold sm:text-sm">Give Admin Access</Switch.Label>
										<Switch
											checked={toggleAdmin}
											onChange={handleToggleAdmin}
											className={`${toggleAdmin ? "bg-green-700" : "bg-gray-400"}
										  scale-50 relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
										>
											<span
												aria-hidden="true"
												className={`${toggleAdmin ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
											/>
										</Switch>
									</Switch.Group>

									<button
										type="button"
										className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-green-700 border border-transparent rounded-md sm:w-full hover:bg-green-600"
										onClick={handleAdminChange}
									>
										{toggleAdmin === user.isAdmin ? "Back" : "Update"}
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default ViewUserDialog;
