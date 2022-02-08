import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import "../styles/globals.css";
import Layout from "../components/Layout";
import "tailwindcss/tailwind.css";


function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    
    useEffect(() => {
        import('tw-elements');
    }, []);

    return (
        <SessionProvider session={session}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    );
}

export default MyApp;
