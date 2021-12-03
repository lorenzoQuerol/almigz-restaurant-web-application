import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Navbar = () => {
    return (
        <nav className="h-24 mb-2 border-t-8 border-green-800 shadow-lg navbar text-neutral-content rounded-box">
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
                </div>
            </div>
            <div className="">
                <Link href="/auth/signIn">
                    <a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">
                        LOGIN
                    </a>
                </Link>
                <Link href="/register">
                    <a className="self-center m-5 font-normal rounded-btn hover:font-medium hover:text-green-700">
                        REGISTER
                    </a>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
