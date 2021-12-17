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
            <div className="w-full text-center">
                <h1 className="font-bold">Binalot</h1>
                <Link href="/menu/pork-binagoongan">Pork Binagoongan</Link><br/>
                <Link href="/menu/al-migz-sisig">Al Migz Sisig</Link><br/>
                <h1 className="font-bold">House Specialties</h1>
                <Link href="/menu/sizzling-sisig">Sizzling Sisig</Link><br/>
                <h1 className="font-bold">Pancit in Boxes</h1>
                <Link href="/menu/malabon-small">Malabon (Small)</Link><br/>
                <Link href="/menu/malabon-medium">Malabon (Medium)</Link><br/>
                <h1 className="font-bold">Desserts and Refreshments</h1>
                <Link href="/menu/coke-1-5l">Coke 1.5L</Link><br/>
            </div>
            
        </>
    );
}
