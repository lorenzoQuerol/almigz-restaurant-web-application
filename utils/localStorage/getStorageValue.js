export default function getStorageValue(key) {
	if (typeof window !== "undefined") {
		if (key === "foodCart") {
			const { data: foodCart } = JSON.parse(localStorage.getItem("foodCart"));

			let total = 0;
			if (foodCart) foodCart.forEach((item) => (total += item.menuItem.productPrice * item.quantity));

			return { data: foodCart, total: total };
		}

		if (key === "transaction") {
			const item = JSON.parse(localStorage.getItem(key));
			return item;
		}
	}
}
