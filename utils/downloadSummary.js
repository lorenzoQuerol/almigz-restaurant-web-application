const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "August", "Sept.", "Oct.", "Nov.", "Dec."];

// DOWNLOAD FUNCTION
const downloadCSV = (csv) => {
	const today = new Date();
	const date = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
	const time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds() + "-" + today.getMilliseconds();
	const dateTime = date + "_" + time;

	let tag = document.createElement("a");
	let csvFile = new Blob([csv], { type: "text/plain" });
	tag.href = URL.createObjectURL(csvFile);
	tag.download = "SummaryReport_" + dateTime + ".csv";
	tag.click();
};

// DATE FORMATTER
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
	return `${formatDate} @ ${time}`;
};

export default function downloadSummary(data) {
	const status = ["INCOMING", "PROCESSED", "IN PREPARATION", "READY FOR PICKUP/DELIVERY", "COMPLETED ORDER", "CANCELLED ORDER"];
	let transArr = [];
	let json = [];
	for (let i = 0; i < data.length; i++) transArr.push(data[i]);

	// PREPROCESS DATA FOR CSV
	transArr.forEach((trans) => {
		let foodArr = [];
		for (let i = 0; i < trans.order.length; i++) foodArr.push(trans.order[i]);

		foodArr.forEach((food) => {
			let tempLoc;
			switch (food.branch) {
				case "Molino Boulevard":
					tempLoc = "MV";
					break;
				case "Unitop Mall Dasmariñas":
					tempLoc = "UT";
					break;
				case "V Central Mall":
					tempLoc = "VC";
					break;
				default:
					tempLoc = "Unknown";
			}

			let entry = {
				"Invoice Number": trans.invoiceNum,
				Branch: tempLoc,
				Status: status[trans.orderStatus],
				Remarks: trans.reasonForCancel,
				"Payment Method": trans.payMethod,
				"Date Created": formatDate(trans.dateCreated),
				"Product Name": food.menuItem.productName,
				Qty: food.quantity,
				"Total Price": food.quantity * food.menuItem.productPrice,
			};

			json.push(entry);
		});
	});

	json = json.reverse();
	if (json.length) {
		let fields = Object.keys(json[0]);
		let replacer = function (key, value) {
			return value === null ? "" : value;
		};

		let csv = json.map(function (row) {
			return fields
				.map(function (fieldName) {
					return JSON.stringify(row[fieldName], replacer);
				})
				.join(",");
		});
		csv.unshift(fields.join(",")); // add header column
		csv = csv.join("\r\n");

		downloadCSV(csv);
	} else {
		window.alert("No Transactions Found");
	}
}
