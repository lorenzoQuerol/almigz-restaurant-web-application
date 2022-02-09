import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import "../styles/globals.css";
import Layout from "@components/Layout";
// import AdminLayout from "@components/AdminLayout";
import "tailwindcss/tailwind.css";

// const layouts = {
// 	consumer: Layout,
// 	admin: AdminLayout,
// };

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	// const Layout = layouts[Component.layout] || ((children) => <>{children}</>);

	useEffect(() => {
		import("tw-elements");
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
