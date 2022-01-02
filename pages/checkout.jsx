import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import getCart from '@utils/foodCart/getCart';
import confirmTransaction from '@utils/confirmTransaction';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CheckoutPage() {
    // Session
    const { data: session, status } = useSession();

    // User
    const [user, setUser] = useState();

    // TEMPORARY - delivery fee
    const delFee = 50;

    // Additional details
    const [type, setType] = useState('Delivery');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNum, setContactNum] = useState([]);
    const [order, setOrder] = useState([]);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    // Delivery details
    const [address, setAddress] = useState('');
    const [payMethod, setPayMethod] = useState('');
    const [change, setChange] = useState(0);
    const [deliverTime, setDeliverTime] = useState('Now');

    // Pickup details
    const [storeLocation, setStoreLocation] = useState('');
    const [pickupTime, setPickupTime] = useState('Now');

    const { data, error } = useSWR(`/api/users/${email}`, fetcher);
    const cart = getCart();

    useEffect(() => {
        if (session) setEmail(session.user.email);
        if (data) setUser(data.data);
        if (cart) setOrder(cart);
        if (user) {
            setFullName(`${user.firstName} ${user.lastName}`);
            setEmail(user.email);
            setContactNum([user.contactNum, user.altContactNum]);
            setAddress(user.homeAddress);
            setTotalPrice(order.total + delFee);

            // TEMPORARY - test transaction
            setPayMethod('GCash');
            setChange(1000);
            setDeliverTime('Now');
        }
    }, [session, email, data, user]);

    // Submit transaction
    const submitTransaction = async (event) => {
        event.preventDefault();

        // Initialize transaction object
        const transaction = {
            orderStatus: 0,
            type: type,
            fullName: fullName,
            email: email,
            contactNum: contactNum,
            order: order,
            specialInstructions: specialInstructions,
            totalPrice: totalPrice,
            address: address,
            payMethod: payMethod,
            change: change,
            deliverTime: deliverTime,
            storeLocation: storeLocation,
            pickupTime: pickupTime,
        };

        // Send transaction object
        const response = await confirmTransaction(transaction);
        console.log(response);
    };

    return (
        <>
            CHECKOUT: <br />
            <form onSubmit={submitTransaction}>
                <button>Place Order (Open Receipt)</button>
            </form>
        </>
    );
}
