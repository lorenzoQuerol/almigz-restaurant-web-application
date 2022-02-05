import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useSWR from "swr";

//sample values (R)
const sample1 = {
	sectionNumber: 1,
	sectionTitle: "Section Title 1",
	sectionContent: "Lorem ipsum dolor sit amet. Non consequuntur magnam sed voluptas quod aut incidunt commodi aut rerum impedit. Id amet quia in natus corporis aut accusamus amet ad cupiditate corporis est fugit sapiente et internos nostrum. Vel quaerat quam rem optio maxime eum reiciendis architecto sed possimus voluptatibus. Non eius omnis et nisi quasi et sapiente repellat aut fugit pariatur et reprehenderit dolor aut nesciunt molestiae qui repellat nulla. Ad cupiditate dignissimos qui nulla perspiciatis ea doloremque rerum sit facilis velit sit molestiae harum At magni dolorum eos totam voluptas? A dolor officiis et necessitatibus illo non cumque beatae et maxime ipsa. Ut repudiandae perspiciatis vel eaque voluptate est ratione aperiam ut velit voluptatem hic expedita fuga. Sit labore dolor aut quos recusandae et necessitatibus aperiam. Qui culpa explicabo eum internos quis qui expedita ipsum."
}

const sample2 = {
	sectionNumber: 2,
	sectionTitle: "Section Title 2",
	sectionContent: "Lorem ipsum dolor sit amet. Non consequuntur magnam sed voluptas quod aut incidunt commodi aut rerum impedit. Id amet quia in natus corporis aut accusamus amet ad cupiditate corporis est fugit sapiente et internos nostrum. Vel quaerat quam rem optio maxime eum reiciendis architecto sed possimus voluptatibus. Non eius omnis et nisi quasi et sapiente repellat aut fugit pariatur et reprehenderit dolor aut nesciunt molestiae qui repellat nulla. Ad cupiditate dignissimos qui nulla perspiciatis ea doloremque rerum sit facilis velit sit molestiae harum At magni dolorum eos totam voluptas? A dolor officiis et necessitatibus illo non cumque beatae et maxime ipsa. Ut repudiandae perspiciatis vel eaque voluptate est ratione aperiam ut velit voluptatem hic expedita fuga. Sit labore dolor aut quos recusandae et necessitatibus aperiam. Qui culpa explicabo eum internos quis qui expedita ipsum."
}

const sample3 = {
	sectionNumber: 3,
	sectionTitle: "Section Title 3",
	sectionContent: "Lorem ipsum dolor sit amet. Non consequuntur magnam sed voluptas quod aut incidunt commodi aut rerum impedit. Id amet quia in natus corporis aut accusamus amet ad cupiditate corporis est fugit sapiente et internos nostrum. Vel quaerat quam rem optio maxime eum reiciendis architecto sed possimus voluptatibus. Non eius omnis et nisi quasi et sapiente repellat aut fugit pariatur et reprehenderit dolor aut nesciunt molestiae qui repellat nulla. Ad cupiditate dignissimos qui nulla perspiciatis ea doloremque rerum sit facilis velit sit molestiae harum At magni dolorum eos totam voluptas? A dolor officiis et necessitatibus illo non cumque beatae et maxime ipsa. Ut repudiandae perspiciatis vel eaque voluptate est ratione aperiam ut velit voluptatem hic expedita fuga. Sit labore dolor aut quos recusandae et necessitatibus aperiam. Qui culpa explicabo eum internos quis qui expedita ipsum."
}

const samples = [sample2, sample1, sample3];

const fetcher = (url) => fetch(url).then((res) => res.json());

const TermsDialog = ({ openTermsDialog, handleOpenTermsDialog }) => {
	/*	ACTUAL - might need to change "termsConditions"
	
	const { data, error } = useSWR("/api/termsConditions", fetcher);
	if (!data) return <h1 className="h-screen">Loading...</h1>;

	const sections = data.termsConditions.sort((a, b) => a.sectionNumber - b.sectionNumber);
	*/

	//for testing (R)
	const sections = samples.sort((a, b) => a.sectionNumber - b.sectionNumber);

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
							<div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
								<div className="flex justify-between items-start pb-3 md:px-4 rounded-t border-b ">
									<Dialog.Title as="h3"  className="text-xl font-semibold text-gray-900 lg:text-2xl ">
										Terms and Conditions
									</Dialog.Title>
									<button className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center " onClick={handleOpenTermsDialog}>
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
									</button>
								</div>
								<div className="md:p-4 py-3 space-y-6 max-h-80 overflow-y-auto">
								{sections.map((section) => (
									<div>
										<h1 className="font-semibold">{section.sectionNumber}.0 {section.sectionTitle}</h1>
										<p className="text-base px-6 leading-relaxed text-gray-500">
											{section.sectionContent}
										</p>
									</div>
								))}
								</div>

								<div className="flex justify-end mt-2 space-x-4">
									<button
										type="button"
										className="inline-flex justify-center px-4 py-2 text-sm font-medium bg-gray-200 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
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
