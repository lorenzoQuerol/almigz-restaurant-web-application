import Image from "next/image";
import useSWR from "swr";

const sampleHist = ["Almigz Foodhaus was established in August 2010 based on the concept of food recipes wrapped in banana leaves popularly known as “Binalot” and other native Filipino cuisines.", <br/>, <br/>, 
"Binalot is a traditional but very popular Filipino dish and is commonly sought by food lovers in the country. Along with other delicious dishes such as crispy pata, sizzling sisig, sizzling tofu, buttered tuna, chopsuey, bulalo, lomi, “sinigang na hipon”, buttered shrimp, and different types of pancit noodles, giving Almigz customers a variety of foods to choose from. ", <br/>, <br/>, 
"Almigz first branch was opened in Addas Commercial, Bacoor Cavite and within a couple of years of operation its popularity grew and attracted customers from as far as Quezon City, Laguna and surrounding towns. This prompted the owner to transfer to a bigger place along Molino Boulevard, Bacoor Cavite and after several years, it has expanded its operation by opening 2 more branches, one in V. Central Mall Bacoor Cavite and the other in Unitop Mall Dasmarinas Cavite. ", <br/>, <br/>, 
"To support the company’s expansion program, a central commissary was established in Pag-asa Imus Cavite. ", <br/>, <br/>, 
"Having our strategic objectives set in place, we are quite optimistic of achieving our vision of becoming one of the most popular restaurant food chains in the country by 2030."];

// sample for testing
const sample = [
	{
		branch: "Molino Boulevard",
		description: "Lorem ipsum dolor sit amet. Ut quae magnam hic animi minima ut incidunt maxime et molestiae nostrum quo voluptatem sunt qui tempora odit.",
		contactNumber: ["(046) 683 – 3933","0955 361 9520"],
		branchImages: ["https://images.ctfassets.net/4vhelr5l3xmh/5whbVM10dF0OMTX7cCZMQl/6b67a31fdeff0b70efdefe6f810242dc/20211120_110017.jpg?",
						"https://images.ctfassets.net/4vhelr5l3xmh/3YxEz1KDfZm0NsW7U7wYSU/157ad888486e07553df475054997d0cc/20211120_110010.jpg?",
						"https://images.ctfassets.net/4vhelr5l3xmh/3FX7nMvKvLmzS9Y2ufmV4i/81306815e4e8acad577e09ba7011e645/20211120_110000.jpg?"]
	},
	{
		branch: "V Central Mall",
		description: "Lorem ipsum dolor sit amet. Ut quae magnam hic animi minima ut incidunt maxime et molestiae nostrum quo voluptatem sunt qui tempora odit. Qui repellat pariatur eum soluta quia est voluptatum eveniet et dolorum Quis rem rerum velit. Eos odio alias vel sequi sunt id nesciunt officiis?",
		contactNumber: ["(046) 683 - 8752","0935 696 8978", "0912 345 6789"],
		branchImages: ["https://images.ctfassets.net/4vhelr5l3xmh/7yyy79MLky41F9GUPSIt95/ea68c9dea8ce199f4c5eb9e7b35f3193/20211120_135903.jpg?",
						"https://images.ctfassets.net/4vhelr5l3xmh/46IpKgVPwmGpl9FBYjC7Wu/c80e9de5fa6b6bf5924ce5ce340a2ca4/20211120_141835.jpg?",
						"https://images.ctfassets.net/4vhelr5l3xmh/2UwnNZTXOWXDKz3KKU1r9A/26b2e4bf48a06f4ac0747df07db8b863/20211120_135931.jpg?"]
	},
	{
		branch: "Unitop Mall Dasmariñas",
		description: "Lorem ipsum dolor sit amet.",
		contactNumber: ["0997 760 5792"],
		branchImages: ["https://images.ctfassets.net/4vhelr5l3xmh/5jTQVDOQXbwKEh7TuiVyBf/455cb6f9bb1d815cb26d80edc502e4d5/20211203_200601.jpg?",
						"https://images.ctfassets.net/4vhelr5l3xmh/6Yv6gIKlqpBPGm9UOwzuSx/cf9502967426699acf4461418f348adf/20211203_200606.jpg?",
						"https://images.ctfassets.net/4vhelr5l3xmh/mGzbZNrzLuG9DSkcJoDOC/41cb5ddcf8a2d40e170caec35f4f7d97/20211203_200618.jpg?",
						"https://images.ctfassets.net/4vhelr5l3xmh/3PpIvWo8Jn8oVlEP27kapN/78a6d34f990e19efbcaea55063958794/20211203_200604.jpg?"]
	}
]

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function About() {
	// const { data:about, error: bannersError} = useSWR("/api/about", fetcher);
	// const { data:branches, error: menuError} = useSWR("/api/branches", fetcher);

	// if (!data) return <h1 classNameName="h-screen">Loading...</h1>;

	// for testing (R)
	const branches = sample;
	const about = sampleHist;
	const background = "/about.jpg"

	return (
		<>
			<div className="2xl:container 2xl:mx-auto lg:pb-16 lg:px-20 md:pb-12 md:px-6 pb-9 px-4">
				{/* Brief History */}
				<div className="flex flex-col justify-between">
					<div className="w-full h-full bg-cover" style={{backgroundImage: `url(${background})`}}>
					<div className="w-full overlay flex flex-col justify-center text-center px-4 md:px-12 lg:px-24 py-8 lg:py-12 font-rale backdrop-blur-sm bg-black/70">
						<h1 className="text-3xl lg:text-4xl mb-6 font-bold leading-9 text-white font-rale">Brief History</h1>
						<p className="font-normal text-base leading-6 text-white ">{about}</p>
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
										{branchObj.branchImages.map((pic, j) => (
											<div className={`${j == 1 ? 'active' : ''} carousel-item relative float-left w-full`}>
												<Image key={j}
													width={4000}
													height={3000}
													src={pic}
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
