import downloadSummary from "@utils/downloadSummary";
import useAxios from "axios-hooks";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Loading from "@components/Loading";
const status = ["INCOMING", "PROCESSED", "IN PREPARATION", "READY FOR PICKUP/DELIVERY", "COMPLETED ORDER", "CANCELLED ORDER"];
const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "August", "Sept.", "Oct.", "Nov.", "Dec."];
const statColors = ["bg-red-200", "bg-yellow-200", "bg-[#CF9FFF]", "bg-blue-200", "bg-green-200", "bg-gray-200"];
const statTextColors = ["text-red-900", "text-yellow-900", "text-[#320064]", "text-blue-900", "text-green-900", "text-gray-900"];
const headers = ["Invoice #", "Date Created", "Type", "Branch", "Total Price", ""];
import moment from "moment";

export default function Summary() {
	const dateToday = new Date().toISOString();
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			specificDate: dateToday.slice(0, 10),
			frDate: dateToday.slice(0, 10),
			toDate: dateToday.slice(0, 10),
		},
	});

	const [{ data, loading, error }, refetch] = useAxios({
		url: `${process.env.NEXTAUTH_URL}/api/transactions`,
	});

	const formatDate = (date) => {
		date = new Date(date).toLocaleString("en-US", {
			weekday: "short",
			day: "numeric",
			year: "numeric",
			month: "long",
			hour: "numeric",
			minute: "numeric",
		});
		const tempDate = new Date(date);

		// Get formatted date and time
		const formatDate = `${months[tempDate.getMonth()]} ${tempDate.getDate()}, ${tempDate.getFullYear()}`;
		const time = date.slice(23);

		// Return formatted date
		return `${formatDate}`;
	};

	const validRange = (frDate, toDate) => frDate > toDate; // NOTE time validator

	const handleDownload = () => {
		downloadSummary(filtered);
		// if (formData.summaryType === "Date Range") downloadSummary(data.transactions, formData.frDate, formData.toDate);
		// else downloadSummary(data.transactions, formData.specificDate, formData.specificDate);
	};

	// NOTE Filters transactions based on the date range or specific date
	let filtered = data?.transactions.filter((t) => {
		if (watch("summaryType") == "Date Range") {
			let frDate = new Date(watch("frDate")).toDateString();
			let toDate = new Date(watch("toDate")).toDateString();
			let dateCreated = new Date(t.dateCreated).toDateString();

			return moment(dateCreated).isBetween(frDate, toDate, undefined, "[]");
		} else {
			let chosenDate = new Date(watch("specificDate")).toDateString();
			let dateCreated = new Date(t.dateCreated).toDateString();
			return chosenDate === dateCreated;
		}
	});

	return (
		<div className="text-gray-800 font-rale">
			{loading ? (
				<Loading />
			) : (
				<div>
					<div className="flex pb-5 ">
						<div className="text-xl font-bold sm:text-3xl">Summary Report</div>
					</div>
					<form onSubmit={handleSubmit(handleDownload)}>
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
								{validRange(watch("frDate"), watch("toDate")) && (
									<div className="mb-1 text-xs font-medium text-left text-red-500">Start date must be before end date</div>
								)}
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
					<div className="flex pb-5 ">
						<div className="text-xl font-bold sm:text-3xl">
							Summary Report for{" "}
							{watch("summaryType") == "Specific Date"
								? dateToday.slice(0, 10) === watch("specificDate")
									? "Today"
									: formatDate(watch("specificDate")).slice(0, 14)
								: `${formatDate(watch("frDate"))} - ${formatDate(watch("toDate"))}`}
						</div>
					</div>
					<div className="container mx-auto bg-white rounded shadow">
						{/* SECTION Table */}
						{filtered.length ? (
							<div className="w-full overflow-x-scroll xl:overflow-x-hidden">
								<table className="min-w-full bg-white">
									<thead>
										<tr className="w-full h-16 py-8 border-b border-gray-300">
											{headers.map((item, index) => {
												return <th className="px-6 text-sm font-medium leading-4 tracking-normal text-left">{item}</th>;
											})}
										</tr>
									</thead>
									<tbody>
										{filtered.map((item, index) => {
											return (
												<tr className="border-b border-gray-300 h-14">
													<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">#{item.invoiceNum}</td>
													<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">{formatDate(item.dateCreated)}</td>
													<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">{item.type}</td>
													<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">{item.branch}</td>
													<td className="px-6 text-xs leading-4 tracking-normal whitespace-no-wrap">₱{item.totalPrice}</td>
													<Link href={`/admin/orders/${item.invoiceNum}`}>
														<td className="px-5 text-xs text-center transition-colors bg-green-700 border-b border-gray-200 cursor-pointer hover:bg-green-600">
															<a className="font-bold text-white">View</a>
														</td>
													</Link>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						) : (
							<div className="justify-center py-2 font-medium text-center">No Transactions Found</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

Summary.layout = "admin";
