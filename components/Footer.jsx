import Link from "next/link";
import Logo from "/public/Logo.png";
import Image from "next/image";
import useSWR from "swr";

import { useState } from "react";
import TermsDialog from "@components/TermsConditions";
import PrivDialog from "@components/PrivacyPolicy";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Footer = () => {	
	const { data, error } = useSWR("/api/branches", fetcher);
	const [openTermsDialog, setOpenTermsDialog] = useState(false);
	const [openPrivDialog, setOpenPrivDialog] = useState(false);

	if (!data) return <h1 className="overlay">Loading...</h1>;

	const branches = data.branchItems;

	const handleTermsDialog = () => {
		// console.log(openTermsDialog);
		setOpenTermsDialog(!openTermsDialog);
	};

	const handlePrivDialog = () => {
		// console.log(openPrivDialog);
		setOpenPrivDialog(!openPrivDialog);
	};

	return (
		<footer className="py-6 lg:py-3 bg-green-700">
			<TermsDialog openTermsDialog={openTermsDialog} handleOpenTermsDialog={handleTermsDialog} />
			<PrivDialog openPrivDialog={openPrivDialog} handleOpenPrivDialog={handlePrivDialog} />
			<div className="container px-6 mx-auto space-y-3 divide-y divide-coolGray-400 divide-opacity-50">
				<div className="grid grid-cols-12 lg:pt-4 lg:pb-8 text-white">
					<div className="pb-2 col-span-full self-start lg:col-span-3">
						<a rel="noopener noreferrer" href="#" className="flex justify-center space-x-3 lg:justify-start">
							{/* <span className="self-center text-2xl font-semibold">Brand name</span> */}
							<Image className="self-center inline-block fill-current" src={Logo} width={200} height={40} />
						</a>
					</div>
					{branches.map((branchObj) => (
						<div className="col-span-full p-2 text-center lg:text-right lg:pt-0 md:col-span-4 lg:col-span-3 justify-self-auto">
							<p className="text-lg font-medium w-full">{branchObj.branch}</p>
							<ul>
								{branchObj.contactNumber.map((num) => (
								<li>
									<p className="text-gray-300 font-light">{num}</p>
								</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="grid justify-center pt-3 md:justify-between">
					<div className="flex flex-col self-center text-white text-sm text-center md:block md:col-start-1 md:space-x-6">
						<span className="order-last md:order-first md:self-end text-black font-semilight pt-4">©2022 All rights reserved</span>
						<a rel="noopener noreferrer" className="hover:cursor-pointer hover:underline hover:text-black" href="/about">
							<span>About Us</span>
						</a>
						<a rel="noopener noreferrer" className="hover:cursor-pointer hover:underline hover:text-black" onClick={handlePrivDialog}>
							<span>Privacy Policy</span>
						</a>
						<a rel="noopener noreferrer" href="#" className="hover:cursor-pointer hover:underline hover:text-black" onClick={handleTermsDialog}>
							<span>Terms & Conditions</span>
						</a>
					</div>
					<div className="flex justify-center pt-4 space-x-4 md:pt-0 md:col-end-13">
						<Link href="https://www.facebook.com/AlmigzSpecialBinalot">
							<a target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-white">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-green-700 w-5 h-5">
									<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
								</svg>
							</a>
						</Link>
						<Link href="https://m.me/AlmigzSpecialBinalot">
							<a target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-white">
								<svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px" className="fill-green-700 w-5 h-5">
									<path d="M 25 2 C 12.300781 2 2 11.601563 2 23.5 C 2 29.800781 4.898438 35.699219 10 39.800781 L 10 48.601563 L 18.601563 44.101563 C 20.699219 44.699219 22.800781 44.898438 25 44.898438 C 37.699219 44.898438 48 35.300781 48 23.398438 C 48 11.601563 37.699219 2 25 2 Z M 27.300781 30.601563 L 21.5 24.398438 L 10.699219 30.5 L 22.699219 17.800781 L 28.601563 23.699219 L 39.101563 17.800781 Z"/>
								</svg>
							</a>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
