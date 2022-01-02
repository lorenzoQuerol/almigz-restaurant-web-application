export default function getCart() {
	if (typeof window !== "undefined") {
		const foodCart = JSON.parse(localStorage.getItem("foodCart"));

		let total = 0;
		if (foodCart) foodCart.forEach((item) => (total += item.menuItem.productPrice * item.quantity));

		return { data: foodCart, total: total };
	}
}
