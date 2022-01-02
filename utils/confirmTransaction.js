import axios from 'axios';

export default async function confirmTransaction(newTransaction) {
    try {
        // Pre-process cart for transaction
        newTransaction.order.data.forEach((item) => {
            delete item.menuItem.category;
            delete item.menuItem.productDescription;
            delete item.menuItem.isAvailable;
            delete item.menuItem.productImagesCollection;
            delete item.menuItem.slug;
            delete item.menuItem.available;
        });

        // Set to null for fields not required in DELIVERY type
        if (newTransaction.type === 'Delivery') {
            newTransaction.storeLocation = null;
            newTransaction.pickupTime = null;
        }

        // Set to null for fields not required in PICKUP type
        if (newTransaction.type === 'Pickup') {
            newTransaction.address = null;
            newTransaction.payMethod = null;
            newTransaction.change = null;
            newTransaction.deliverTime = null;
        }

        console.log(newTransaction);
        const response = await axios.post(`${process.env.NEXTAUTH_URL}/api/transactions`, newTransaction);
        const success = { success: response.data.success, msg: response.data.msg };
        return success;
    } catch (err) {
        const error = { success: err.response.data.success, msg: err.response.data.msg };
        return error;
    }
}
