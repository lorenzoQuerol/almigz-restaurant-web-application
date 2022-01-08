import useSWR from "swr";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MenuPage() {
	const { data, error } = useSWR("/api/foodItems", fetcher);

	return (
		<>
			<div className="w-full text-center">
				<h1 className="font-bold">Binalot</h1>
				<Link href="/menu/pork-binagoongan">Pork Binagoongan</Link>
				<br />
				<Link href="/menu/al-migz-sisig">Al Migz Sisig</Link>
				<br />
				<h1 className="font-bold">House Specialties</h1>
				<Link href="/menu/sizzling-sisig">Sizzling Sisig</Link>
				<br />
				<h1 className="font-bold">Pancit in Boxes</h1>
				<Link href="/menu/malabon-small">Malabon (Small)</Link>
				<br />
				<Link href="/menu/malabon-medium">Malabon (Medium)</Link>
				<br />
				<h1 className="font-bold">Desserts and Refreshments</h1>
				<Link href="/menu/coke-1-5l">Coke 1.5L</Link>
				<br />
			</div>
		</>
	);
}
