import Link from "next/link";
import Logo from "/public/Logo.png";
import Image from "next/image";

import { useState } from "react";
import TermsDialog from "@components/TermsConditions";
import PrivDialog from "@components/PrivacyPolicy";


const Footer = () => {
	const [openTermsDialog, setOpenTermsDialog] = useState(false);
	const [openPrivDialog, setOpenPrivDialog] = useState(false);

	const handleTermsDialog = () => {
		// console.log(openTermsDialog);
		setOpenTermsDialog(!openTermsDialog);
	};

	const handlePrivDialog = () => {
		// console.log(openPrivDialog);
		setOpenPrivDialog(!openPrivDialog);
	};

	return (
		<footer className="bg-yellow-100 p-7 footer font-rale text-slate-900 footer-center">
			<TermsDialog openTermsDialog={openTermsDialog} handleOpenTermsDialog={handleTermsDialog} />
			<PrivDialog openPrivDialog={openPrivDialog} handleOpenPrivDialog={handlePrivDialog} />		
			<div>
				<Image className="inline-block fill-current" src={Logo} width={200} height={40} />
				<p className="font-bold">
					<a className="mx-3" onClick={handlePrivDialog}>Privacy Policy</a>
					<a className="mx-3" onClick={handleTermsDialog}>Terms and Conditions</a>
					<br />
				</p>
				<p>Copyright © 2010 - All rights reserved</p>
			</div>
			<div>
				<div className="grid grid-flow-col">
					<Link href="https://www.facebook.com/AlmigzSpecialBinalot">
						<a target="_blank" rel="noopener noreferrer">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
								<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
							</svg>
						</a>
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
