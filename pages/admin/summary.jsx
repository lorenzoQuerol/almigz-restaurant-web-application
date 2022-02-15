import downloadSummary from "@utils/downloadSummary";
import useAxios from "axios-hooks";
import React, { useState,useEffect } from "react";

// Get date and time
const today = new Date();
const date = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0');
const time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds() + "-" + today.getMilliseconds();;
const dateTime = date+'_'+time;

export default function Summary() {
	
	const [{ data, loading, error }, refetch] = useAxios({
		url: `${process.env.NEXTAUTH_URL}/api/transactions`
	});
	
	const [frDate, setFrDate] = useState();
	const [toDate, setToDate] = useState();
	
	function download(){
		if(frDate<=toDate ){
			downloadSummary(data.transactions,frDate,toDate);
		}
		
	}
	
	// ANCHOR Refetch for pagination
	useEffect(() => {
		setTimeout(() => {
			refetch();
		}, 60000);
	}, [data]);

	return (
		<div>
			<div className="flex-row pb-5 sm:flex">
				<div className="flex-row self-center flex-1 sm:ml-5">
					<form>
						<span className="mr-2 font-bold">From Date</span>
						<input type="date"
							onChange={(e) => setFrDate(e.target.value)}
						></input>
					</form>
				</div>
				<div className="flex-row self-center flex-0 sm:ml-5">
					<form>
						<span className="mr-2 font-bold">To Date</span>
						<input type="date"
							onChange={e => setToDate(e.target.value)}
						></input>
					</form>
				</div>
			</div>
			<div className="flex self-center justify-between text-white lg:space-x-10 lg:justify-center">
				<div className="flex flex-col mt-3 w-52">
					<button
						type="button"
						onClick={download}
						className={`px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-green-700 border rounded hover:bg-green-600 focus:outline-none`}
					>
						Download Summary
					</button>
				</div>			
			</div>
		</div>
	);
}

Summary.layout = "admin";
