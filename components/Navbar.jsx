import Link from 'next/link';
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Navbar = () => {
  return (
    <nav>
    	<div class="">
			<div class="">
                <Link href="/">
				<div class="">
                <Image src="/logo.png" alt="store-logo" width={200} height={50}/>
				</div>
                </Link>

				<Link href="/">
                <a class="">
					HOME
				</a>
                </Link>
                
				<Link href="/menu">
                <a class="">
					MENU
				</a>
                </Link>
			</div>
		</div>
    </nav>
	);
}
 
export default Navbar;