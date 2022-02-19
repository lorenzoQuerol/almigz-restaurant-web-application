import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { getSession } from "next-auth/react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export async function getServerSideProps(context) {
	const session = await getSession(context);

	if (session?.user.isAdmin) {
		return {
			redirect: {
				permanent: false,
				destination: "/admin",
			},
		};
	}

	return {
		props: { session },
	};
}

export default function Home(session) {
	const { data, error } = useSWR("/api/home", fetcher);

	if (!data) return <h1 className="h-full">Loading...</h1>;

	const banners = data.homepageItems[0];

	console.log(banners.announcementsCollection.items[2]);
	return (
		<>
			<div className="flex flex-col items-center w-full">
				<div id="banners" className="carousel slide relative" data-bs-ride="carousel" data-bs-pause="hover">
					<div className="carousel-inner relative w-full overflow-hidden">
						{banners.announcementsCollection.items.map((pic, i) => (
						<div className={`${i == 1 ? "active" : ""} carousel-item relative float-left w-full`}>
							<Image
								src={pic.url}
								width={3500} height={1500}
								className="block"
								alt="..."
							/>
						</div>
						))}
						<div className="block absolute text-center w-full h-full bg-gradient-to-b from-white/0 via-white/0 to-yellow-600/90">
							<div className="carousel-caption absolute bottom-2 text-center p-0 pb-2 md:pb-5">
								<h1 className="text-black font-rale font-bold mb-1 md:mb-2 lg:mb-4 lg:mb-6 text-sm md:text-3xl lg:text-5xl 2xl:text-6xl tracking-wide" >{banners.label}</h1>
								<a
									className="inline-block px-4 py-2 md:px-7 md:py-3 border md:border-2 border-white text-xs lg:text-lg 2xl:text-3xl font-sans  bg-black/60 hover:backdrop-none hover:border-black hover:text-black rounded text-white font-medium leading-snug uppercase hover:bg-black hover:bg-opacity-5"
									href="/menu"
									role="button"
								>View Menu</a>
							</div>
						</div>
					</div>
					<button
						className="carousel-control-prev absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline left-0"
						type="button"
						data-bs-target="#banners"
						data-bs-slide="prev"
					>
						<span className="carousel-control-prev-icon inline-block bg-no-repeat" aria-hidden="true"></span>
						<span className="visually-hidden">Previous</span>
					</button>
					<button
						className="carousel-control-next absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline right-0"
						type="button"
						data-bs-target="#banners"
						data-bs-slide="next"
					>
						<span className="carousel-control-next-icon inline-block bg-no-repeat" aria-hidden="true"></span>
						<span className="visually-hidden">Next</span>
					</button>
				</div>

				<div className="flex flex-wrap mt-6 items-center self-center justify-center text-center h-full">
					<h1 className="p-2 text-sm md:text-xl font-bold text-black font-rale w-full">Also available in: </h1>
					<div className="rounded p-2 m-4 bg-white border-2 border-gray-200 hover:border-green-600 h-14 w-50" data-tip="https://food.grab.com/ph/en/">
					<Link href="https://food.grab.com/ph/en/" target="_blank">
						<a target="_blank" rel="noopener noreferrer">
							<Image src="/grab.png" className="block m-2" alt="grabfood" width={180} height={30} />
						</a>
					</Link>
					</div>
					<div className="rounded p-2 m-4 bg-white border-2 border-gray-200 hover:border-pink-600 h-14 w-50" data-tip="https://food.grab.com/ph/en/">
					<Link href="https://www.foodpanda.ph/" target="_blank">
						<a target="_blank" rel="noopener noreferrer">
							<Image src="/panda.png" className="block m-2" alt="grabfood" width={200} height={40} />
						</a>
					</Link>
					</div>
				</div>
			</div>
		</>
	);
}

Home.layout = "consumer";
