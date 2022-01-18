import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

const DeleteDialog = ({ openDeleteDialog, handleOpenDeleteDialog, handleDeleteAccount }) => {
	return (
		<>
			<Transition appear show={openDeleteDialog} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto text-slate-900" onClose={handleOpenDeleteDialog}>
					<div className="min-h-screen px-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-200"
							enterFrom="opacity-5"
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
							<div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
								<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
									Delete Account?
								</Dialog.Title>
								<div className="mt-2">
									<p className="text-sm text-gray-500">
										Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
									</p>
								</div>

								<div className="flex justify-end mt-4 space-x-4">
									<button
										type="button"
										className="inline-flex justify-center px-4 py-2 text-sm font-medium bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
										onClick={handleDeleteAccount}
									>
										Delete
									</button>
									<button
										type="button"
										className="inline-flex justify-center px-4 py-2 text-sm font-medium bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
										onClick={handleOpenDeleteDialog}
									>
										Cancel
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
