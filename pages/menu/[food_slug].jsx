import { data } from "autoprefixer";
// import { useRouter } from "next/router";
import { useSession} from "next-auth/react";
import { useState } from "react";
import Image from "next/image";


import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function FoodItemPage() {
    // const router = useRouter();
    // const slug = router.query.food_slug;
    // console.log('/api/foodItems/' + slug);
    const { data, error } = useSWR('/api/foodItems/food-item-2', fetcher);
    const { data: session, status } = useSession();

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    // console.log(data.data);
    var total = data.data.productPrice * 1;
    
    // const [qty, setQty] = useState("");
    // const [total, setTotal] = useState("");
    // setTotal(1);
    // const updateTotal = async (event) => {
    //     setTotal(data.data.productPrice * qty);
    //     // console.log(quantity);
    //     // Check if credentials are complete
        
    //     // const total = data.data.productPrice * quantity;
    //     // console.log(total);
    // };


    
    
    return (
        <>
            <div className="w-1/2 flex-col text-center rounded-md shadow-2xl shadow-yellow-400 p-10">
                <h1 className="text-3xl font-rale text-black font-bold">{data.data.productName}</h1>
                <h1>{data.data.category}</h1>
                <Image src="/menu/binalot/bangus.jpg" className="shadow-2xl shadow-black-400 bg-green-100" width="300" height="200"/>
                <h1 className="mt-8">{data.data.productDescription}</h1>
                <h1 className="text-green-700 font-bold text-2xl mt-5 p-6">{total}</h1>
                <form>
                <input
                    className="input p-5 input-sm input-bordered rounded-md focus:ring-2 focus:ring-blue-300" 
                    type='number'
                    min='1'
                    max='9999' 
                    placeholder="1"
                    // onChange={}
                    ></input>
                <button className="font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300">
                        Add to Cart
                </button>
                </form>
            </div>
        </>
    )
}
