// import Footer from "../components/Footer";
// import Navbar from "../components/Navbar";
// import styles from "../styles/Home.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from 'swr';
import Link from "next/link";


const fetcher = (url) => fetch(url).then((res) => res.json());
// console.log(fetcher);
export default function MenuPage() {
    const { data, error } = useSWR('api/foodItems', fetcher);
    const { data: session, status } = useSession();
    console.log(data);
    
    
    
    
    
    
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
            DASHBOARD: <br/>
            <a className="bg-red-400 h-10 text-black" href="/orders/1" target="_blank">
                <btn>ORDER#0000</btn>
            </a>
        </>
    );
}
