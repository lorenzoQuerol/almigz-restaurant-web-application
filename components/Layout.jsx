import Head from "next/head";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
	return (
		<>
			{/* <html > */}
			<div className="w-full">
				<Head>
					<title>Al Migz Special Binalot</title>
					<link rel="icon" href="/logo.ico" />
				</Head>
				<Navbar />
				<div className="justify-center overflow-x-hidden">{children}</div>
				<Footer />
			</div>
			{/* </html> */}
		</>
	);
};

export default Layout;
