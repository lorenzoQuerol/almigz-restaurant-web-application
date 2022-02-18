import downloadSummary from "@utils/downloadSummary";
import useAxios from "axios-hooks";
import React, { useState,useEffect } from "react";
import moment from 'moment';


export default function Summary() {
	const [{ data, loading, error }, refetch] = useAxios({
		url: `${process.env.NEXTAUTH_URL}/api/transactions`
	});
	
	const [frDate, setFrDate] = useState(moment().format('YYYY-MM-DD'));
	const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'));
	
	//Get date input
	const onChangeDate = e => {
		const newDate = moment(new Date(e.target.value)).format('YYYY-MM-DD');
		switch(e.target.name) {
			case "frDate":
				setFrDate(newDate)
			  break;
			case "toDate":
				setToDate(newDate)
			  break;
			default:
				console.log("err")
		}
	};

	function download(){
		var validFrDate = !(frDate == "Invalid date");
		var validToDate = !(toDate == "Invalid date");
		console.log(validToDate)
		console.log(validFrDate)
		
		if(validFrDate && validToDate)
			downloadSummary(data.transactions,frDate,toDate);
		else{
			var dateToday = moment().format('YYYY-MM-DD');
			window.alert("Invalid date, downloading only today's transactions");
			downloadSummary(data.transactions,dateToday,dateToday);
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
							name = "frDate"
							value = {frDate}
							onChange={onChangeDate}
						></input>
					</form>
				</div>
				<div className="flex-row self-center flex-0 sm:ml-5">
					<form>
						<span className="mr-2 font-bold">To Date</span>
						<input type="date"
							name = "toDate"
							value = {toDate}
							onChange={onChangeDate}
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
