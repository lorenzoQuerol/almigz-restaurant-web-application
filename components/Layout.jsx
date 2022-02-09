import Head from "next/head";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";

const Layout = ({ children }) => {
	return (
		<div className="w-full">
			<Head>
				<title>Al Migz Special Binalot</title>
				<link rel="icon" href="/icon.ico" />
			</Head>
			<Navbar />
			<div className="justify-center min-h-screen overflow-x-hidden">{children}</div>
			<Footer />
		</div>
	);
};

export default Layout;
