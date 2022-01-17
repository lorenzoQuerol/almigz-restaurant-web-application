import Link from "next/link";
import Logo from "/public/Logo.png";
import Image from "next/image";

const Footer = () => {
	return (
		<footer className="bg-yellow-100 p-7 footer font-rale text-slate-900 footer-center">
			<div>
				<Image className="inline-block fill-current" src={Logo} width={200} height={40} />
				<p className="font-bold">
					<Link href="/#">
						<a className="mx-3">Contact Us</a>
					</Link>
					<Link href="/#">
						<a className="mx-3">Terms and Conditions</a>
					</Link>
					<Link href="/#">
						<a className="mx-3">Privacy Policy</a>
					</Link>
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
