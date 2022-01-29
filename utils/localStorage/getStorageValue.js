export default function getStorageValue(key) {
	if (typeof window !== "undefined") {
		if (key === "foodCart") {
			let foodCart = JSON.parse(localStorage.getItem("foodCart"));
			return foodCart;
		}

		if (key === "transaction") {
			const transaction = JSON.parse(localStorage.getItem("transaction"));
			return transaction;
		}
	}
}
