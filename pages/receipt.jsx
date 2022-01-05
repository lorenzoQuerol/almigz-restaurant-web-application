import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

//sample order array (R)
const products = [
    {
        quantity: 3,
        menuItem: {
            productName:'Pork Binagoongan',
            productPrice: 80.00,
        }
    },
    {
        quantity: 1,
        menuItem: {
            productName:'Malabon (Small)',
            productPrice: 380.00,
        }
    },
    {
        quantity: 2,
        menuItem: {
            productName:'Malabon Medium',
            productPrice: 80.00,
        }
    },
    {
        quantity: 4,
        menuItem: {
            productName:'Sizzling Sisig',
            productPrice: 90.00,
        }
    }
]

//SAMPLE: DEL-COD (R)
var transSample1 = {
    invoiceNum: 1,
    dateCreated: "01/05/2022 06:40:40",
    orderStatus: 0,
    type: "Delivery",
    fullName: "John Doe",
    email: "johndoe@gmail.com",
    contactNum: [ "+639123456789", "+639012345678"],
    order: products,
    specialInstructions: "Lorem ipsum dolor sit amet. Hic sunt reiciendis et necessitatibus magnam est odio nihil qui sint dolores quo libero vitae et nihil repudiandae et nobis mollitia? Eos voluptatibus deleniti non molestias laboriosam eum impedit quidem ad sunt nesciunt ut dolores corrupti et eius fugit. Et veritatis voluptas vel accusantium praesentium qui nobis saepe et nostrum sint.",
    totalPrice: 1190.00,
    address: "2401 Taft Ave, Malate, Manila, 1004 Metro Manila",
    payMethod: "Cash on Delivery",
    change: "810",
    deliverTime: "Now",
    storeLocation: "",
    pickupTime: "",
    reason: ""
}

//SAMPLE: DEL-GCASH (R)
var transSample2 = {
    invoiceNum: 1,
    dateCreated: "01/05/2022 06:40:40",
    orderStatus: 0,
    type: "Delivery",
    fullName: "John Doe",
    email: "johndoe@gmail.com",
    contactNum: [ "+639123456789", "+639012345678"],
    order: products,
    specialInstructions: "Lorem ipsum dolor sit amet. Hic sunt reiciendis et necessitatibus magnam est odio nihil qui sint dolores quo libero vitae et nihil repudiandae et nobis mollitia? Eos voluptatibus deleniti non molestias laboriosam eum impedit quidem ad sunt nesciunt ut dolores corrupti et eius fugit. Et veritatis voluptas vel accusantium praesentium qui nobis saepe et nostrum sint.",
    totalPrice: 1190.00,
    address: "2401 Taft Ave, Malate, Manila, 1004 Metro Manila",
    payMethod: "GCash",
    change: "",
    deliverTime: "11:00 AM",
    storeLocation: "",
    pickupTime: "",
}

//SAMPLE: PICKUP (R)
var transSample3 = {
    invoiceNum: 1,
    dateCreated: "01/05/2022 06:40:40",
    orderStatus: 0,
    type: "Pickup",
    fullName: "John Doe",
    email: "johndoe@gmail.com",
    contactNum: [ "+639123456789", "+639012345678"],
    order: products,
    specialInstructions: "Lorem ipsum dolor sit amet. Hic sunt reiciendis et necessitatibus magnam est odio nihil qui sint dolores quo libero vitae et nihil repudiandae et nobis mollitia? Eos voluptatibus deleniti non molestias laboriosam eum impedit quidem ad sunt nesciunt ut dolores corrupti et eius fugit. Et veritatis voluptas vel accusantium praesentium qui nobis saepe et nostrum sint.",
    totalPrice: 1190.00,
    address: "2401 Taft Ave, Malate, Manila, 1004 Metro Manila",
    payMethod: "",
    change: "",
    deliverTime: "",
    storeLocation: "Branch 1",
    pickupTime: "12:00 PM",
}

// const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Receipt() {
    /* FETCHING (K) */
    // const router = useRouter();
	// const { data, error } = useSWR(`/api/transactions/${router.query.order_detail}`, fetcher);
	
	// if (error) return <div>failed to load</div>;
	// if (!data) return <div>loading</div>;


    /* SAMPLES (R) */
    // const trans = transSample1;
    // const trans = transSample2;
    // const trans = transSample3;

    /* ACTUAL (K)*/ 
    // const trans = data.data;

    var delFee, payMethod, total, cash, change;
    /* Delivery Fee & Payment Method (K) */
    
    console.log(trans.type === "Delivery");
	if (trans.type === "Delivery") {
        delFee = 50; //temporary 
        payMethod = trans.payMethod; 
    }
    else if (trans.type === "Pickup") {
        delFee = 0;
        payMethod = "(on pickup)"
    }

    /* Set total, cash, and change values (K) */
    if (payMethod === "Cash on Delivery") {
        total = trans.totalPrice;
        change = trans.change;
        cash = parseInt(total) + parseInt(change);
    }
    else if (payMethod === "GCash" || payMethod === "(on pickup)" ) {
        change = "-";
        cash = "-";
        total = "";
    }

	return (
		<div className="w-1/2 flex flex-col mt-5">
			<div className="shadow-xl bg-gray-100 border border-gray-200 p-5 pb-3">
                <h1 className="text-4xl font-rale text-black font-bold">Order #{trans.invoiceNum.toString().padStart(4, '0')}</h1>
                <p className="mt-1 text-sm text-gray-500 ml-1">Date: {trans.dateCreated}</p>
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
                        {trans.order.map((product) => (
                        <tr key={product.menuItem.productName} className="text-center py-3">
                            <td className="py-3 font-sans">{product.quantity}</td> 
                            <td className="">{product.menuItem.productName}</td> 
                            <td className="font-sans">{product.menuItem.productPrice}</td> 
                            <td className="font-sans">{product.menuItem.productPrice * product.quantity}</td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="border-t border-gray-200 pt-8 pb-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>P {trans.totalPrice - delFee}</p>
                    </div>
                    <div className="flex justify-between text-base text-medium text-gray-500 my-3">
                      <p>Delivery Fee</p>
                      <p>P {delFee}</p>
                    </div>
                    <div className="flex justify-between text-xl my-1 font-medium text-gray-900">
                      <p>Total</p>
                      <p>P {trans.totalPrice}</p>
                    </div>
                </div>
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <h1 className="text-normal font-semibold text-gray-900">Payment Method: {payMethod}</h1>
                    <div className="flex justify-between text-base text-gray-900 mt-3">
                      <p>Cash</p>
                      <p>{cash}</p>
                    </div>
                    <div className="flex justify-between text-base text-medium text-gray-400 my-2">
                      <p>Total</p>
                      <p>-{total}</p>
                    </div>
                    <div className="flex justify-between text-base text-gray-900">
                      <p>Change</p>
                      <p>{change}</p>
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
