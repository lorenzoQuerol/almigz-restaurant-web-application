import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";
import { useSession, signIn, signOut } from "next-auth/react";

export default async function Home() {
    const { data: session, status } = useSession();

    /*
      DESIGNERS: You can now use the session to conditionally render components for 
      authenticated or unauthenticated users. Session will return null if user is not
      logged in.

      @status will return "authenticated" | "loading" | "unauthenticated"
    */

    // if (session) {
    //     return (
    //         <>
    //             <div>
    //                 <h1>HOMEPAGE</h1>
    //             </div>
    //             Signed in as {session.user.name} <br />
    //             <button onClick={signOut}>Sign out</button>
    //         </>
    //     );
    // }

    return (
        <>
            <div>
                <h1>HOMEPAGE</h1>
            </div>
            Not signed in <br />
            <button onClick={signIn}>Sign in</button>
        </>
    );
}
