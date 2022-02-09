import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useSWR from "swr";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS } from '@contentful/rich-text-types';

const fetcher = (url) => fetch(url).then((res) => res.json());

const TermsDialog = ({ openTermsDialog, handleOpenTermsDialog }) => {
	const { data, error } = useSWR("/api/termsConditions", fetcher);
	if (!data) return <h1 className="overlay">Loading...</h1>;

	const sections = data.termsConditionsItems.sort((a, b) => a.sectionNumber - b.sectionNumber);

	const options = {
		renderNode: {
		  [BLOCKS.UL_LIST]: (node, children) => {
		  	return (<ul  className="list-disc indent-0 p-10">{children}</ul>);
		  },
		  [BLOCKS.LIST_ITEM]: (node, children) => {
			return (<li>{children}</li>);
		  }
		}
	  };

	return (
		<>
			<Transition appear show={openTermsDialog} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto text-slate-900" onClose={handleOpenTermsDialog}>
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
						<span className="inline-block mt-8 h-screen align-middle" aria-hidden="true">
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
							<div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
								<div className="flex justify-between items-center p-4 md:p-6 rounded-t border-b">
									<Dialog.Title as="h3"  className="text-lg font-semibold text-gray-900 lg:text-2xl">
										Terms and Conditions
									</Dialog.Title>
									<button className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center " onClick={handleOpenTermsDialog}>
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
									</button>
								</div>
								<div className="max-h-80 overflow-y-auto px-5 py-3 md:px-7 md:py-6">
								{sections.map((section) => (
									<div className="pb-2">
										<h1 className="font-semibold pb-2">{section.sectionNumber}.0<span className="pl-2">{section.sectionTitle}</span></h1>
										<div className="space-y-6 indent-10 pb-4 leading-relaxed text-gray-900">
											{documentToReactComponents(section.sectionContent.json, options)}
										</div>
									</div>
								))}
								</div>
								<div className="flex justify-end p-4 md:p-6 space-x-2 rounded-b border-t border-gray-200">
									<button
										type="button"
										className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
										onClick={handleOpenTermsDialog}
									>
										Close
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

export default TermsDialog;
