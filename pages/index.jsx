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

	if (!session)
		return {
			redirect: {
				permanent: false,
				destination: "/signin",
			},
		};

	return {
		props: session,
	};
}

export default function Home(session) {
	const { data, error } = useSWR("/api/home", fetcher);

	if (!data) return <h1 className="h-screen">Loading...</h1>;

	const banners = data.homepageItems;
	return (
		<>
			<div className="flex flex-col items-center justify-center w-full">
				{/* {banners.map((pics) => (
					<div className="flex flex-col">
						{pics.announcementsCollection.items.map((pic, index) => (
							<a key={index} className="">
								<Image className="" src={pic.url} alt="announcement" width={1260} height={825} />
							</a>
						))}
					</div>
				))} */}

				{/* <div className="sticky flex items-center self-center justify-center w-full p-4 mb-2 bg-black opacity-75 bottom-36">
					<h1 className="mr-4 italic font-light text-gray-400">Order now: </h1>
					<Link href="/menu">
						<a className="p-2 m-2 text-xl font-semibold text-yellow-600 border-2 border-yellow-500 font-rale rounded-btn hover:text-white hover:bg-yellow-500 hover:border-none">
							VIEW MENU
						</a>
					</Link>
			</div> */}
				<div className="flex flex-wrap items-center self-center justify-center mt-10">
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

Home.layout = "consumer";
