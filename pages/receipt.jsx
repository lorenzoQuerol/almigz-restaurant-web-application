import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";


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
    // console.log(datetime);
	return (
		<div className="w-1/2 flex flex-col mt-5">
			<div className="shadow-xl bg-gray-100 border border-gray-200 p-5 pb-3">
                <h1 className="text-4xl font-rale text-black font-bold">Order #{num}</h1>
                <p className="mt-1 text-sm text-gray-500 ml-1">Date: {datetime}</p>
			</div>
            <div className="border border-gray-200 shadow-xl  p-5 bg-white">
                <div className="flex justify-between">
                    <table className="table-auto w-full mt-3 font-rale text-black divide-y divide-gray-500">
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
                            <td className="py-3 font-sans">{product.qty}</td> 
                            <td className="">{product.productName}</td> 
                            <td className="font-sans">{product.price}</td> 
                            <td className="font-sans">{product.price * product.qty}</td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="border-t border-gray-200 pt-8 pb-6 px-4 sm:px-6">
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
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
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
                <p className="mt-5 text-sm text-gray-500">This report is generated automatically and does not serve as an official receipt.</p>
		    </div>
            <button className="font-normal self-center text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300"
                onClick={() => router.push('/tracker')}>
                Proceed to Order Tracker
            </button>
        </div>
	);
}
