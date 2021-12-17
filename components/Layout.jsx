import Head from "next/head";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
    return (
        <>
        <html data-theme="lofi" className="w-full">
            <div>
                <Head>
                    <title>Al Migz Special Binalot</title>
                    <link rel="icon" href="/logo.ico" />
                </Head>
                <Navbar/>
                <div className="flex justify-center w-screen min-h-screen">{children}</div>
                <Footer/>
            </div>
        </html>
        </>
    );
};

export default Layout;
