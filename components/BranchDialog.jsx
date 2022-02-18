import { Fragment, useState, useEffect } from "react";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const BranchDialog = ({ openBranch, setOpenBranch, handleBranchDialog }) => {
	const { data, error } = useSWR("/api/branches", fetcher);
	const [branches, setBranches] = useState([]);
	const [selected, setSelected] = useState("");

	const handleSelected = (value) => {
		if (value !== false) {
			setSelected(value);
			handleBranchDialog(value);
			localStorage.setItem("branch", JSON.stringify(value));
		}
		setOpenBranch(!openBranch);
	};

	useEffect(() => {
		if (data) setBranches(data.branchItems);
	}, [data]);

	return (
		<>
			<Transition appear show={openBranch} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto text-gray-800 font-rale" onClose={handleSelected}>
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
							<Dialog.Overlay className="fixed inset-0 bg-gray-800 blur-2xl opacity-40" />
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
							<div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow">
								<Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-800">
									Choose a Branch
								</Dialog.Title>
								<Dialog.Description className="text-sm">This will determine the available food items available per branch.</Dialog.Description>
								<RadioGroup value={selected} onChange={handleSelected} className="mt-2">
									<RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
									<div className="space-y-2">
										{branches.map((item, index) => (
											<RadioGroup.Option
												key={index}
												value={item.branch}
												className={({ active, checked }) =>
													`${active ? "ring-white ring-opacity-60" : ""}
                  ${checked ? "bg-green-700 text-white" : "bg-white"}
                    relative rounded shadow px-5 py-4 cursor-pointer flex focus:outline-none`
												}
											>
												{({ active, checked }) => (
													<>
														<div className="flex items-center justify-between w-full">
															<div className="flex items-center">
																<div className="text-sm">
																	<RadioGroup.Label as="p" className={`font-medium  ${checked ? "text-white" : "text-gray-800"}`}>
																		{item.branch}
																	</RadioGroup.Label>
																</div>
															</div>
															{checked && (
																<div className="flex-shrink-0 text-white">
																	<CheckIcon className="w-6 h-6" />
																</div>
															)}
														</div>
													</>
												)}
											</RadioGroup.Option>
										))}
										<p className="self-center text-xs italic">NOTE: Changing branches will clear your food cart!</p>
									</div>
								</RadioGroup>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default BranchDialog;
