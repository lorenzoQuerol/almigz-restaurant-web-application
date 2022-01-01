import Link from "next/link";

const Footer = () => {
    return (
      <>
        <footer className="absolute bottom border-b-8 border-green-800 shadow-xl flex-col text-center w-screen pb-5 pb-5">
          <div className="flex flex-col justify-center m-5">
            <p>Al Migz Special Binalot</p>
            <p>Since 2010</p>
          </div> 
            
          <div>
            <nav>
              <ul className="flex flex-row justify-center">
                <li className="self-center ml-5 mr-5 font-normal rounded-btn hover:font-medium hover:text-green-700">
                  <Link href="/contact">
                    <a>Contact Us</a>
                  </Link>
                </li>
                <li className="self-center ml-5 mr-5 font-normal rounded-btn hover:font-medium hover:text-green-700">
                  <Link href="/termsandconditions">
                    <a>Terms and Conditions</a>
                  </Link>
                </li>
                <li className="self-center ml-5 mr-5 font-normal rounded-btn hover:font-medium hover:text-green-700">
                <Link href="/privacy">
                    <a>Privacy Policy</a>
                  </Link>
                </li>
                <li>
                <Link href="https://www.facebook.com/pages/Almigz-Special-Binalot-Restaurant/386760148076911" className="hover:">
                  <a>
                    <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} className="fill-blue" viewBox="0 0 16 16">
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                    </svg>
                  </a>
                </Link>
              </li>
              </ul>
            </nav>
          </div>
        </footer>
      </>
    );
  }
   
  export default Footer;