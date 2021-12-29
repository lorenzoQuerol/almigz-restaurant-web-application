import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

//temporary invoice number (starting at 1)
var inv = 1;

//to get date
Date.prototype.today = function () { 
    return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+ this.getFullYear();
}

//to get time
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

//sample array
const products = [
    {
        qty: 3,
        productName:'Pork Binagoongan',
        price: 80,
        // total: 240 optional
    },
    {
        qty: 1,
        productName:'Malabon (Small)',
        price: 380,
        // total: 380 optional
    },
    {
        qty: 2,
        productName:'Malabon Medium',
        price: 80,
        // total: 160 optional
    },
    {
        qty: 4,
        productName:'Sizzling Sisig',
        price: 90,
        // total: 360 optional
    }
]

export default function Receipt() {
    const [delfee, setDelFee] = useState(50);
    const [subtotal, setSubtotal] = useState(200);
    const [total, setTotal] = useState(delfee + subtotal);
    const router = useRouter();
    //get date and time string
    var datetime = new Date().today() + "   " + new Date().timeNow();
    
    //display invoice number with leading 0's (Order #0001)
    const num = inv.toString().padStart(4, '0');

    //Specify mode of payment
    const mop = "Cash on Delivery";
    const cash = 1000;
    const change = 20;

    //newly added vars
    const col = "red";
    const status = "INCOMING ORDER";
    const delpick = "Delivery";
    const userInfo = {
        name: "John Doe",
        email:"johndoe@gmail.com",
        contact: [ "+639123456789", "+639012345678"],
        address: "2401 Taft Ave, Malate, Manila, 1004 Metro Manila"
    }
    const notes = "Lorem ipsum dolor sit amet. Hic sunt reiciendis et necessitatibus magnam est odio nihil qui sint dolores quo libero vitae et nihil repudiandae et nobis mollitia? Eos voluptatibus deleniti non molestias laboriosam eum impedit quidem ad sunt nesciunt ut dolores corrupti et eius fugit. Et veritatis voluptas vel accusantium praesentium qui nobis saepe et nostrum sint."
    // console.log(datetime);
	return (
        <div className={`w-full flex flex-col`}>
            <div className="flex flex-row justify-center items-start  m-5">
                <div className="w-1/2 self-left flex flex-col">
                    <div className="flex flex-col border rounded-md">
                        <div className="shadow-lg bg-gray-100 flex rounded-t justify-between items-center p-5 pb-3">
                            <div className="">
                                <h1 className="text-4xl font-rale text-black font-bold">Order #{num}</h1>
                                <p className="mt-1 text-sm text-gray-500 ml-1">Date: {datetime}</p>
                            </div>
                            <div className={`p-2 bg-${col}-500 text-white font-normal flex items-center rounded-lg`}>{status}</div>
                        </div>
                        <div className="shadow-lg p-5 pt-4 bg-white rounded-b">
                            <div className="flex justify-between">
                                <table className="table-auto w-full font-rale text-black divide-y divide-gray-500">
                                    <thead>
                                    <tr>
                                        <th className="py-2">Quantity</th> 
                                        <th>Item Name</th> 
                                        <th>Price per piece</th>
                                        <th>Total Price</th>
                                    </tr>
                                    </thead> 
                                    <tbody className="divide-y divide-gray-200">
                                    {products.map((product) => (
                                    <tr key={product.productName} className="text-center py-3">
                                        <td className="py-1 font-sans">{product.qty}</td> 
                                        <td className="">{product.productName}</td> 
                                        <td className="font-sans">{product.price}</td> 
                                        <td className="font-sans">{product.price * product.qty}</td>
                                    </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* <p className="mt-5 text-sm text-gray-500">This report is generated automatically and does not serve as an official receipt.</p> */}
                        </div>
                    </div>                        
                    {/* <div className="border-t border-gray-200 pt-8 pb-6 px-4 sm:px-6"> */}
                    <div className="bg-white border shadow-lg rounded-md mt-2 flex justify-between items-center flex-row">
                        <div className="p-5 px-4 sm:px-6">
                            <h1 className="text-normal font-semibold text-gray-900">Payment Method: {mop}</h1>
                            <div className="flex justify-between text-base text-gray-900 mt-3">
                            <p>Cash</p>
                            <p>P{cash}</p>
                            </div>
                            <div className="flex justify-between text-base text-medium text-gray-400 my-2">
                            <p>Total</p>
                            <p>- P{total}</p>
                            </div>
                            <div className="flex justify-between text-base text-gray-900">
                            <p>Change</p>
                            <p>P{change}</p>
                            </div>
                        </div>
                        <div className="p-5 w-1/3 divide-y">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Subtotal</p>
                            <p>P{subtotal}</p>
                            </div>
                            <div className="flex justify-between text-base text-medium text-gray-500 my-3">
                            <p>Delivery Fee</p>
                            <p>P{delfee}</p>
                            </div>
                            <div className="flex justify-between text-xl my-1 font-medium text-gray-900">
                            <p>Total</p>
                            <p>P{total}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-3 mx-3 w-1/4 border rounded-md text-black bg-white shadow-lg divide-y">
                    <div className="text-center bg-red-100">
                            <b>For {delpick.toUpperCase()}</b><br/>
                            {delpick} Time: 11:00 A.M.
                    </div>
                    <div className="py-2 pb-10">
                            <b> {userInfo.name}</b><br/>
                            {userInfo.email}<br/>
                            {userInfo.contact.map((num) => (
                            <span>{num}<br/></span>
                            ))}
                            {userInfo.address}<br/>
                    </div>
                    <div className="pt-2 text-gray-400 font-light leading-normal text-sm">
                        <span className="italic font-medium">Special Instructions</span><br/>
                        <span>{notes}</span>
                    </div>
                </div>
            </div>
            {/* <div className={`sticky left-0 bottom-0 bg-white w-full shadow-${col}`}> */}
            <div className={`flex-col bg-gradient-to-t from-gray-100 w-full flex justify-center p-3`}>
                <div className="flex justify-center">
                    <ul className="w-2/3 steps">
                        <li data-content="?" className="step step-neutral ">Incoming</li> 
                        <li data-content="!" className="step step-neutral">Processed</li> 
                        <li data-content="✓" className="step step-neutral">In Preparation</li> 
                        <li data-content="✕" className="step step-neutral">In Delivery/<br/>Ready for Pick up</li> 
                        <li data-content="★" className="step step-neutral">Completed</li>
                    </ul>
                </div>
                <div className="self-center">
                    <button className="font-normal self-center text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300"
                        onClick={() => router.push('/tracker')}>
                        Accept Order
                    </button>
                    <button className="font-normal self-center text-white rounded-lg m-2 p-4 pl-7 pr-7 bg-red-500 hover:font-medium hover:bg-red-300"
                        onClick={() => router.push('/tracker')}>
                        Cancel Order
                    </button>
                </div>
                <span className="text-center">Go to <span className="self-center font-semibold underline hover:text-green-700"><Link href="/orders"> DASHBOARD</Link></span></span>
            </div>
        </div>
	);
}
