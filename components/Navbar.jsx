import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Navbar = () => {
    return (
        <nav class="navbar h-24 mb-2 shadow-lg text-neutral-content rounded-box border-t-8 border-green-800">
            <div class="flex items-center">
                <div class="lg:flex self-center text-base ">
                    <Link href="/">
                        <div class="m-4">
                            <Image src="/logo.png" alt="store-logo" width={200} height={50} />
                        </div>
                    </Link>

                    <Link href="/">
                        <a class="font-normal rounded-btn self-center m-5 hover:font-medium hover:text-green-700">
                            HOME
                        </a>
                    </Link>

                    <Link href="/menu">
                        <a class="font-normal rounded-btn self-center m-5 hover:font-medium hover:text-green-700">
                            MENU
                        </a>
                    </Link>
                </div>
            </div>
            <div class="">
                <Link href="/login">
                    <a class="font-normal rounded-btn self-center m-5 hover:font-medium hover:text-green-700">
                        LOGIN
                    </a>
                </Link>
                <Link href="/register">
                    <a class="font-normal rounded-btn self-center m-5 hover:font-medium hover:text-green-700">
                        REGISTER
                    </a>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
