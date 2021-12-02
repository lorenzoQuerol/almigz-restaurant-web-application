import axios from "axios";

async function registerUser(newUserData) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/users`, newUserData);
        const success = { success: response.data.success, msg: response.data.msg };
        return success;
    } catch (err) {
        const error = { success: err.response.data.success, msg: err.response.data.msg };
        return error;
    }
}

export default registerUser;
