import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Navbar = () => {
    return (
        <nav>
            <div className="">
                <div className="">
                    <Link href="/">
                        <div className="">
                            <Image src="/logo.png" alt="store-logo" width={200} height={50} />
                        </div>
                    </Link>

                    <Link href="/">
                        <a className="">HOME</a>
                    </Link>

                    <Link href="/menu">
                        <a className="">MENU</a>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
