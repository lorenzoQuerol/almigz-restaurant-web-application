import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { data } from "autoprefixer";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
	const { data, error } = useSWR("/api/homepage/", fetcher);

	if (error) return <div>failed to load</div>;
	if (!data) return <div>Loading...</div>;

	const banners = data.data;

	return (
		<>
			<div className="flex-col justify-center w-full">
				<div className="flex items-center self-center justify-center mb-2 bg-yellow-100">
					<h1 className="mr-4 italic font-light text-gray-500">Order now: </h1>
					<Link href="/menu">
						<a className="p-2 m-2 text-xl font-semibold text-yellow-600 border-2 border-yellow-500 font-rale rounded-btn hover:text-white hover:bg-yellow-500 hover:border-none">
							VIEW MENU
						</a>
					</Link>
				</div>
				{banners.map((pics) => (
					<div>
						{pics.announcementsCollection.items.map((pic) => (
							<Image className="" src={pic.url} alt="announcement" width={1260} height={825} />
						))}
					</div>
				))}
				<div className="flex items-center self-center justify-center mt-10">
					<h1 className="p-2 text-xl font-bold text-black font-rale">Also available in: </h1>
					<a href="https://food.grab.com/ph/en/" target="_blank">
						<div className="p-2 m-4 bg-white tooltip hover:border-2 hover:border-green-600 h-14 w-50" data-tip="https://food.grab.com/ph/en/">
							<Image src="/grab.png" className="m-2 bg-white btn hover:bg-white" alt="grabfood" width={180} height={30} />
						</div>
					</a>
					<a href="https://www.foodpanda.ph/" target="_blank">
						<div className="p-2 m-4 bg-white tooltip hover:border-2 hover:border-pink-600 h-14 w-65" data-tip="https://www.foodpanda.ph/">
							<Image src="/panda.png" className="m-2 bg-white btn hover:bg-white" alt="foodpanda" width={200} height={40} />
						</div>
					</a>
				</div>
			</div>
		</>
	);
}
