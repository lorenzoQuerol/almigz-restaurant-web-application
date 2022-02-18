import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const DeleteDialog = ({ openDeleteDialog, handleDeleteDialog, handleDeleteAccount }) => {
	return (
		<>
			<Transition appear show={openDeleteDialog} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto text-gray-800" onClose={(e) => handleDeleteDialog(e)}>
					<div className="min-h-screen px-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-200"
							enterFrom="opacity-10"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-50"
							leaveTo="opacity-0"
						>
							<Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
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
							<div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-md font-rale">
								<Dialog.Title as="div" className="flex items-center pb-3">
									<div className="-ml-1 text-gray-600 dark:text-gray-400">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="text-gray-800 icon icon-tabler icon-tabler-trash"
											width={32}
											height={32}
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path stroke="none" d="M0 0h24v24H0z" />
											<line x1={4} y1={7} x2={20} y2={7} />
											<line x1={10} y1={11} x2={10} y2={17} />
											<line x1={14} y1={11} x2={14} y2={17} />
											<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
											<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
										</svg>
									</div>
									<p className="pl-2 text-lg font-semibold">Delete Your Account?</p>
								</Dialog.Title>
								<div className="mt-2">
									<p className="text-sm text-gray-600">
										Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
									</p>
								</div>

								<div className="flex justify-end mt-4 space-x-4">
									<button
										onClick={handleDeleteAccount}
										className="px-3 py-2 text-xs text-white transition duration-150 ease-in-out bg-red-800 rounded focus:outline-none hover:bg-red-700"
									>
										Delete Account
									</button>
									<button
										onClick={handleDeleteDialog}
										className="w-20 px-3 py-2 text-xs text-white transition duration-150 ease-in-out bg-yellow-700 rounded focus:outline-none hover:bg-yellow-600"
									>
										Back
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

export default DeleteDialog;
