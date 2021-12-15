import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useSession, signIn, signOut } from "next-auth/react";


const Navbar = () => {
    const { data: session, status } = useSession();
    
    if (session) {
        return (
            <>
                <nav className="w-full h-24 mb-2 border-t-8 border-green-800 shadow-lg navbar text-neutral-content rounded-box">
                    <div className="flex items-center">
                        <div className="self-center text-base lg:flex ">
                            <Link href="/">
                                <div className="m-4">
                                    <Image src="/logo.png" alt="store-logo" width={200} height={50} />
                                </div>
                            </Link>
                            <Link href="/">
                                <a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">
                                    HOME
                                </a>
                            </Link>

                            <Link href="/menu">
                                <a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">
                                    MENU
                                </a>
                            </Link>

                            <Link href="/about">
                                <a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">
                                    ABOUT US
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="flex justify-end items-center flex-1 m-3">
                        <a href="/cart">
                                <div className="m-4">
                                    <Image src="/cart.png" className="bg-white rounded hover:bg-green-100" alt="Add to Cart" width={35} height={35} />
                                </div>
                        </a>                     
                        <div className="dropdown">
                            <div  tabindex="0" class="m-1 btn font-normal bg-white rounded ">
                                Hi, {session.user.name}!
                                <svg className="ml-2" width="10px" height="10px" viewBox="0 -6 524 524" xmlns="http://www.w3.org/2000/svg" ><title>Account Options</title><path d="M64 191L98 157 262 320 426 157 460 191 262 387 64 191Z" /></svg>
                            </div> 
                            <ul className="p-2 shadow shadow menu dropdown-content bg-base-100 rounded w-44 divide-y">
                                <li>
                                <a href="/account">My Account</a>
                                </li>  
                                <li>
                                <a onClick={signOut} >Sign Out</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </>
        );
    }
    else {
        return (
            <nav className="w-full h-24 mb-2 border-t-8 border-green-800 shadow-lg navbar text-neutral-content rounded-box">
                <div className="flex items-center">
                    <div className="self-center text-base lg:flex ">
                        <Link href="/">
                            <a className="m-4">
                                <Image src="/logo.png" alt="store-logo" width={200} height={50} />
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">
                                HOME
                            </a>
                        </Link>
    
                        <Link href="/menu">
                            <a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">
                                MENU
                            </a>
                        </Link>
                        <Link href="/about">
                                <a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">
                                    ABOUT US
                                </a>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-end mr-3 items-stretch flex-1">
                    <div className="flex divide-x divide-gray-400">
                        <Link href="/auth/signIn">
                            <a className="self-center p-2 font-normal rounded-btn hover:font-medium hover:text-green-700">
                                Login
                            </a>
                        </Link>
                        <Link href="/register">
                            <a className="self-center p-2 font-normal rounded-btn hover:font-medium hover:text-green-700">
                                Sign Up
                            </a>
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }


    
};

export default Navbar;
