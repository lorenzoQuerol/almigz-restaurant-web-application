import axios from "axios";

export default async function confirmTransaction(newTransaction) {
	try {
		const response = await axios.post(`${process.env.NEXTAUTH_URL}/api/transactions`, newTransaction);
		const success = { success: response.data.success, msg: response.data.msg };
		return success;
	} catch (err) {
		const error = { success: err.response.data.success, msg: err.response.data.msg };
		return error;
	}
}
