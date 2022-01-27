// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import updateStatus from "@utils/updateStatus"

import { useState, useEffect } from "react";
import useSWR, {useSWRConfig} from 'swr'
// import {} from 'swr'
import createConnection from "@utils/mongoDBConnection";
import { getSession, signOut } from "next-auth/react";
import User from "@models/UserModel";
import useAxios from 'axios-hooks'

const fetcher = (url) => fetch(url).then((res) => res.json());


export async function getServerSideProps(context) {
    const session = await getSession(context);
    await createConnection();
    const response = JSON.stringify(await User.findOne({ email: session.user.email }, { _id: false, __v: false, isAdmin: false, isDelete: false, cart: false }));
    return {
        props: JSON.parse(response),
    };
}


export default function status(user) {
    const [status, setStatus] = useState(); 
    const [{ data, loading, error }, refetch] = useAxios({
        url: `${process.env.NEXTAUTH_URL}/api/history/${user.email}`
    });
    useEffect(() => {
        setTimeout(function() {
            refetch();
        }, 5000);
        if(data){
            setStatus(data.transactions.transactions[data.transactions.transactions.length - 1].orderStatus);
        }
    }, [data]);
    return (
        <div>
            <a className="font-bold">Status</a>: {status}
        </div>
    );
    
}