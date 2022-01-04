import Image from "next/image";
import Link from "next/link";
import useSWR from 'swr';
import { data } from "autoprefixer";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
    const { data, error } = useSWR('/api/homepage/', fetcher);

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    // var pic = data.data.announcementsCollection.items;
    // console.log(data.data);
    const banners = data.data;
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
                {banners.map((pics) =>
                    <div>
                    {pics.announcementsCollection.items.map((pic) => (
                        <Image className="" src={pic.url} alt="announcement" width={1260} height={825} />
                    ))} 
                    </div>   
                )}
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
