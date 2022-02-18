import downloadSummary from "@utils/downloadSummary";
import useAxios from "axios-hooks";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import moment from "moment";

export default function Summary() {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { errors },
	} = useForm();

	const [{ data, loading, error }, refetch] = useAxios({
		url: `${process.env.NEXTAUTH_URL}/api/transactions`,
	});

	// NOTE Validates if from date is before to date
	const validRange = (frDate, toDate) => frDate > toDate; // NOTE: time validator

	const downloadSummaries = (formData) => {
		if (formData.summaryType === "Date Range") downloadSummary(data.transactions, formData.frDate, formData.toDate);
		else downloadSummary(data.transactions, formData.specificDate, formData.specificDate);
	};

	return (
		<div className="text-gray-800 font-rale">
			<div className="flex pb-5 ">
				<div className="text-xl font-bold sm:text-3xl">Summary Report</div>
			</div>
			<form onSubmit={handleSubmit(downloadSummaries)}>
				<div>
					<select
						className="w-10/12 max-w-xs px-1 py-1 mb-3 border rounded sm:w-fit md:w-1/2 lg:w-full focus:border-1 focus:outline-none focus:border-green-700"
						{...register("summaryType")}
					>
						<option>Specific Date</option>
						<option>Date Range</option>
					</select>
				</div>

				{watch("summaryType") == "Date Range" ? (
					<div>
						<div className="mb-2 text-base font-semibold">Choose Date Range</div>
						<div className="space-x-4">
							<input
								type="date"
								className="p-1 mb-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-700"
								{...register("frDate", { required: watch("summaryType") == "Date Range" ? true : false })}
							/>

							<input
								type="date"
								className="p-1 mb-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-700"
								{...register("toDate", { required: watch("summaryType") == "Date Range" ? true : false })}
							/>
						</div>
						{errors.frDate?.type === "required" && <div className="mb-1 text-xs font-medium text-left text-red-500">Start Date is required</div>}
						{errors.toDate?.type === "required" && <div className="mb-1 text-xs font-medium text-left text-red-500">End Date is required</div>}
						{validRange(watch("frDate"), watch("toDate")) && <div className="mb-1 text-xs font-medium text-left text-red-500">Start date must be before end date</div>}
					</div>
				) : (
					<div>
						<div className="mb-2 text-base font-semibold">Choose Specific Date</div>
						<div className="">
							<input
								type="date"
								className="p-1 mb-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-700"
								{...register("specificDate", { required: watch("summaryType") == "Specific Date" ? true : false })}
							/>
							{errors.specificDate?.type === "required" && <div className="mb-1 text-xs font-medium text-left text-red-500">Date is required</div>}
						</div>
					</div>
				)}
				<button
					type="submit"
					className={`px-8 py-2 mb-2 mt-1 text-sm text-white transition duration-150 ease-in-out bg-green-700 border rounded hover:bg-green-600 focus:outline-none`}
				>
					Download Summary
				</button>
			</form>
		</div>
	);
}

Summary.layout = "admin";
