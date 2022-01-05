import router, { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import useSWR from 'swr';

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
    reason: "A reason..."
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

/* Status Conditional Rendering Variables (K)*/
const statFlags = new Array(6);
statFlags.fill(false);
const statColors = ["bg-red-200", "bg-yellow-200", "bg-[#CF9FFF]", "bg-blue-200", "bg-green-200", "bg-gray-200"];

// const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Receipt() {
    /* FETCHING (K) */
    // const router = useRouter();
	// const { data, error } = useSWR(`/api/transactions/${router.query.order_detail}`, fetcher);
	
	// if (error) return <div>failed to load</div>;
	// if (!data) return <div>loading</div>;


    /* FOR TESTING ONLY (R) */
    const trans = transSample1;
    // const trans = transSample2;
    // const trans = transSample3;


    /* ACTUAL (K)*/ 
    // const trans = data.data;
    
    const [reason, setReason] = useState(trans.reason);
    const [message, setMessage] = useState("");

    //delpickFlag: true (Delivery), false (Pickup)
    
    var delFee, payMethod, total, cash, change, delpickFlag;
    /* Delivery Fee & Payment Method (K) */
    
    console.log(trans.type === "Delivery");
	if (trans.type === "Delivery") {
        delFee = 50; //temporary 
        payMethod = trans.payMethod; 
        delpickFlag = true;
    }
    else if (trans.type === "Pickup") {
        delFee = 0;
        payMethod = "(on pickup)";
        delpickFlag = false;
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

    /* Set Status Conditional Rendering Flag (K)*/
    statFlags.fill(false);
    statFlags[trans.orderStatus] = true;

    const updateStatus = async (value) => {
        /* TODO: Update orderStatus in database */
		
        /* FOR TESTING ONLY (R) */
        transSample1.orderStatus = parseInt(value); 
        // transSample2.orderStatus = parseInt(value); 
        // transSample3.orderStatus = parseInt(value); 


        router.push('/orders/1'); //temporary - reload same order page
	};

    const saveReason = async (value) => {
        /* TODO: Update reason in database */
        setReason(value);
		transSample1.reason = value; //for testing only (R)
        //if (success)
            setMessage("Changes saved.");
	};
    return (
        <div className={`w-full flex flex-col`}>
            <div className="flex flex-row justify-center items-start  m-5">
                <div className="w-1/2 self-left flex flex-col">
                    <div className="flex flex-col border rounded-md">
                        <div className="shadow-lg bg-gray-100 flex rounded-t justify-between items-center p-5 pb-3">
                            <div className="">
                                <h1 className="text-4xl font-rale text-black font-bold">Order #{trans.invoiceNum.toString().padStart(4, '0')}</h1>
                                <p className="mt-1 text-sm text-gray-500 ml-1">Date: {trans.dateCreated}</p>
                            </div>
                            {statFlags[0] && <div className="p-2 bg-red-500 text-white font-normal flex items-center rounded-lg">INCOMING ORDER</div>}
                            {statFlags[1] && <div className="p-2 bg-yellow-500 text-white font-normal flex items-center rounded-lg">ORDER PROCESSED</div>}
                            {statFlags[2] && <div className="p-2 bg-[#9a37c4] text-white font-normal flex items-center rounded-lg">ORDER IN PREPARATION</div>}
                            {statFlags[3] && <div className="p-2 bg-blue-500 text-white font-normal flex items-center rounded-lg">
                                {delpickFlag &&  <p>ORDER IN DELIVERY</p>}
                                {!delpickFlag && <p>READY FOR PICK UP</p>}
                            </div>}
                            {statFlags[4] && <div className="p-2 bg-green-500 text-white font-normal flex items-center rounded-lg">COMPLETED ORDER</div>}
                            {statFlags[5] && <div className="p-2 bg-gray-500 text-white font-normal flex items-center rounded-lg">CANCELLED ORDER</div>}
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
                                    {trans.order.map((product) => (
                                    <tr key={product.menuItem.productName} className="text-center py-3">
                                        <td className="py-1 font-sans">{product.quantity}</td> 
                                        <td className="">{product.menuItem.productName}</td> 
                                        <td className="font-sans">{product.menuItem.productPrice}</td> 
                                        <td className="font-sans">{product.menuItem.productPrice * product.quantity}</td>
                                    </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>                        
                    <div className="bg-white border shadow-lg rounded-md mt-2 flex justify-between items-center flex-row">
                        <div className="p-5 px-4 sm:px-6">
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
                        <div className="p-5 w-1/3 divide-y">
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
                    </div>
                </div>
                <div className="p-3 mx-3 w-1/4 border rounded-md text-black bg-white shadow-lg divide-y">
                    {/* For DELIVERY */}
                    {delpickFlag && <div className={`text-center ${statColors[trans.orderStatus]}`}>
                            <b>For DELIVERY</b><br/>
                            Delivery Time: {trans.deliverTime}
                    </div>}
                    {!delpickFlag && <div className={`text-center ${statColors[trans.orderStatus]}`}>
                            <b>For PICK UP</b><br/>
                            Store: {trans.storeLocation}<br/>
                            Pick Up Time: {trans.pickupTime}
                    </div>}
                    <div className="py-2 pb-10">
                            <b> {trans.fullName}</b><br/>
                            {trans.email}<br/>
                            {trans.contactNum.map((num) => (
                            <span>{num}<br/></span>
                            ))}
                            {trans.address}<br/>
                    </div>
                    <div className="pt-2 text-gray-400 font-light leading-normal text-sm">
                        <span className="italic font-medium">Special Instructions</span><br/>
                        <span>{trans.specialInstructions}</span>
                    </div>
                </div>
            </div>
            {/* <div className={`sticky left-0 bottom-0 bg-white w-full shadow-${col}`}> */}
            <div className={`flex-col w-full flex justify-center p-3 mb-5`}>
                {statFlags[0] && <div className="self-center">
                    <button className="font-normal self-center text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300"
                        onClick={() => updateStatus(1)}>
                        Accept Order
                    </button>
                    <button className="font-normal self-center text-white rounded-lg m-2 p-4 pl-7 pr-7 bg-red-500 hover:font-medium hover:bg-red-300"
                        onClick={() => updateStatus(5)}>
                        Cancel Order
                    </button>
                
                </div>}
                {statFlags[1] && <div className="self-center">
                    <button className="font-normal self-center text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300"
                        onClick={() => updateStatus(2)}>
                        Prepare Order
                    </button>
                </div>}
                {statFlags[2] && <div className="self-center">
                    <button className="font-normal self-center text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300"
                        onClick={() => updateStatus(3)}>
                        Ready for Deliver / Pickup
                    </button>
                </div>}
                {statFlags[3] && <div className="self-center">
                    <button className="font-normal self-center text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300"
                        onClick={() => updateStatus(4)}>
                        Complete Order
                    </button>
                </div>}
                {statFlags[4] && <div className="self-center">
                    <div className="text-black text-xl font-bold text-center mb-3">ORDER STATUS: <span className="text-green-600">COMPLETED</span> </div>
                </div>}
                {statFlags[5] && <div className="self-center flex flex-col mb-3 w-1/2">
                    <div className="text-black text-xl font-bold text-center mb-3">ORDER STATUS: <span className="text-red-600">CANCELLED</span> </div>
                    <label>
                        Remarks/Reason:
                    </label>
                    <textarea contentEditable="true" suppressContentEditableWarning={true}  
                        className="border focus:text-black p-1" 
                        value={reason} 
                        onChange={(e) => saveReason(e.target.value)}>{trans.reason}</textarea>
                    <p className="italic tracking-wider text-center my-1 text-sm text-green-500 bg-green-100">{message}</p>
                </div>}
                <span className="text-center text-black">Go to <span className="self-center font-semibold underline hover:text-green-700"><Link href="/orders"> DASHBOARD</Link></span></span>
            </div>
        </div>
	);
}
