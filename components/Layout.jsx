import Head from 'next/head'
import Footer from "./Footer"
import Navbar from "./Navbar"

const Layout = ({ children }) => {
  return (
    <html data-theme="lofi">
    <div>
      <Head>
        <title>Al Migz Special Binalot</title>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Navbar />
      { children }
      <Footer />
    </div>
    </html>
  );
}
 
export default Layout;