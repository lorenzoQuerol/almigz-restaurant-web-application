import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";


import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
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
            <div className="flex-col w-full justify-center">
                <div className="flex items-center self-center justify-center mb-2 bg-yellow-100">
                    <h1 className="text-gray-500 mr-4 italic font-light">Order now: </h1>
                    <Link href="/menu">
                        <a className="p-2 m-2 font-semibold font-rale text-xl text-yellow-600 border-yellow-500 rounded-btn border-2 hover:text-white hover:bg-yellow-500 hover:border-none">
                            VIEW MENU
                        </a>
                    </Link>
                </div>    
                <Image className="" src="/banner1.jpeg" alt="announcement" width={1260} height={825} />
                <Image className="" src="/banner2.jpeg" alt="announcement" width={1260} height={825} />

                <div className="flex items-center self-center justify-center mt-10">
                    <h1 className="text-xl font-rale text-black font-bold p-2">Also available in: </h1>
                    <a href="https://food.grab.com/ph/en/" target="_blank">
                        <div className="tooltip m-4 p-2 bg-white hover:border-2 hover:border-green-600 h-14 w-50" data-tip="https://food.grab.com/ph/en/">
                            <Image src="/grab.png" className="btn bg-white hover:bg-white m-2" alt="grabfood" width={180} height={30} />
                            </div>
                    </a>
                    <a href="https://www.foodpanda.ph/" target="_blank">
                        <div className="tooltip m-4 p-2 bg-white hover:border-2 hover:border-pink-600 h-14 w-65" data-tip="https://www.foodpanda.ph/">
                            <Image src="/panda.png" className="btn bg-white hover:bg-white m-2" alt="foodpanda" width={200} height={40} />
                        </div>
                    </a>
                </div> 
            </div>
        </>
    );
}
