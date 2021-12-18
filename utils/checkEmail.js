import axios from "axios";

async function checkEmail(email) {
	try {
		const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/email/${email}`);
		const success = { success: response.data.success, email: response.data.email };
		return success;
	} catch (err) {
		const error = { success: err.response.data.success, msg: err.response.data.msg };
		return error;
	}
}

export default checkEmail;
