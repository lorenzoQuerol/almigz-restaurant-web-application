import downloadSummary from "@utils/downloadSummary";
import useAxios from "axios-hooks";
import React, { useState,useEffect } from "react";



export default function Summary() {
	

	const [{ data, loading, error }, refetch] = useAxios({
		url: `${process.env.NEXTAUTH_URL}/api/transactions`
	});

	function print(){
		downloadSummary(data.transactions)
	}
	
	// ANCHOR Refetch for pagination
	useEffect(() => {
		setTimeout(() => {
			refetch();
		}, 60000);
	}, [data]);

	return (
		<div className="flex self-center justify-between text-white lg:space-x-10 lg:justify-center">
			<div className="flex flex-col mt-3 w-52">
				<button
					type="button"
					onClick={print}
					className={`px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-green-700 border rounded hover:bg-green-600 focus:outline-none`}
				>
					Download Summary
				</button>
			</div>			
		</div>
		
	);
}

Summary.layout = "admin";
