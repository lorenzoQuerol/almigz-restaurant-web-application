import Image from "next/image";
import useSWR from "swr";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function About() {
	const { data:about, error: bannersError} = useSWR("/api/aboutUs", fetcher);
	const { data:branchData, error: menuError} = useSWR("/api/branches", fetcher);
	if (!about) return <h1 className="h-screen">Loading...</h1>;
	if (!branchData) return <h1 className="h-screen">Loading...</h1>;

	const branches = branchData.branchItems;
	const aboutText = about.aboutUsItems.briefSummary;
	const background = about.aboutUsItems.background.url;

	return (
		<>
			<div className="2xl:container 2xl:mx-auto lg:pb-16 lg:px-20 md:pb-12 md:px-6 pb-9 px-4">
				{/* Brief History */}
				<div className="flex flex-col justify-between">
					<div className="w-full h-full bg-cover" style={{backgroundImage: `url(${background})`}}>
					<div className="w-full overlay flex flex-col justify-center text-center px-4 md:px-12 lg:px-24 py-8 lg:py-12 font-rale backdrop-blur-sm bg-black/80">
						<h1 className="text-3xl lg:text-4xl mb-6 font-bold leading-9 text-white font-rale">Brief History</h1>
						<div className="font-normal text-base leading-6 text-white ">{documentToReactComponents(aboutText.json)}</div>
					</div>
					</div>
				</div>

				<div className="flex flex-col justify-between gap-4 pt-12">
					<div className="w-full lg:w-5/12 flex flex-col justify-center">
						<h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 font-rale">Branches</h1>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 md:justify-center gap-4">
						{branches.map((branchObj, i) => (
							<div className="flex border width-1/3 border-gray-100 flex-col bg-white shadow-lg">
								<div id={`branch${i}`} className="carousel slide carousel-fade relative" data-bs-ride="carousel" data-bs-pause="hover" data-bs-interval="5500">
									<div className="carousel-inner relative overflow-hidden">
										{branchObj.branchImagesCollection.items.map((pic, j) => (
											<div className={`${j == 1 ? 'active' : ''} carousel-item relative float-left w-full`}>
												<Image key={j}
													width={4000}
													height={3000}
													src={pic.url}
													className="block w-full object-contain"
													alt="Exotic Fruits"
												/>
											</div>
										))}
									</div>
									<button
										className="carousel-control-prev absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline left-0"
										type="button"
										data-bs-target={`#branch${i}`}
										data-bs-slide="prev"
									>
										<span className="carousel-control-prev-icon inline-block bg-no-repeat" aria-hidden="true"></span>
										<span className="visually-hidden">Previous</span>
									</button>
									<button
										className="carousel-control-next absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline right-0"
										type="button"
										data-bs-target={`#branch${i}`}
										data-bs-slide="next"
									>
										<span className="carousel-control-next-icon inline-block bg-no-repeat" aria-hidden="true"></span>
										<span className="visually-hidden">Next</span>
									</button>
								</div>


								{/* Text Part */}
								<div className="p-6 flex flex-col justify-start">
									<h5 className="text-gray-900 text-xl font-medium mb-2">{branchObj.branch}</h5>
									<p className="text-gray-700 text-base font-rale mb-4">
									{branchObj.description}
									</p>
									<p className="flex-row w-full">
									{branchObj.contactNumber.map((num, k) => (
										<span className="inline-block text-green-600 w-auto justify-items-stretch text-base font-light">{num}
										{branchObj.contactNumber[k + 1] && <span className="px-2">/</span>}
										</span>
									))}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

			</div>
		</>
	);
}
