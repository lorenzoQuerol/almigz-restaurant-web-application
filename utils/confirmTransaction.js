import axios from "axios";

export default async function confirmTransaction(newTransaction) {
	try {
		// Pre-process cart for transaction
		newTransaction.order.forEach((item) => {
			delete item.menuItem.category;
			delete item.menuItem.productDescription;
			delete item.menuItem.isAvailable;
			delete item.menuItem.productImagesCollection;
			delete item.menuItem.slug;
			delete item.menuItem.available;
		});

		// Set to null for fields not required in DELIVERY type
		if (newTransaction.type === "Delivery") {
			newTransaction.storeLocation = null;
			newTransaction.pickupTime = null;
			if (newTransaction.payMethod === "GCash") newTransaction.change = null;
		}

		// Set to null for fields not required in PICKUP type
		if (newTransaction.type === "Pickup") {
			newTransaction.proofPayment = null;
			newTransaction.address = null;
			newTransaction.payMethod = null;
			newTransaction.change = null;
			newTransaction.deliverTime = null;
		}

		// Add a new invoice number property to the transaction
		const countRes = await axios.get(`${process.env.NEXTAUTH_URL}/api/count`);
		const invoiceNum = countRes.data.count;
		newTransaction.invoiceNum = invoiceNum + 1;

		// Add new transaction to database and push into user transaction history
		const response = await axios.post(`${process.env.NEXTAUTH_URL}/api/transactions`, newTransaction);
		await axios.put(`${process.env.NEXTAUTH_URL}/api/history/${newTransaction.email}`, newTransaction);

		const success = response.data;
		return success;
	} catch (err) {
		const error = err.response.data;
		return error;
	}
}
