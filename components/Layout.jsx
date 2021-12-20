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
                <Navbar/>
                <main className="flex justify-center w-screen min-h-screen">{children}</main>
                <Footer/>
            </div>
        {/* </html> */}
        </>
    );
};

export default Layout;
