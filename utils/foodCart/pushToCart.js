export default async function pushToCart(data) {
	if (typeof window !== "undefined") {
		// Get cart from local storage
		let foodCart = JSON.parse(localStorage.getItem("foodCart"));
		if (!foodCart) foodCart = new Array();

		// Check if product already exists in cart; update quantity if found.
		let exists = false;
		foodCart.forEach((product) => {
			if (product.menuItem.productName === data.menuItem.productName) {
				product.quantity = Number(product.quantity) + Number(data.quantity);
				exists = true;
			}
		});

		// Else, push to cart
		if (!exists) foodCart.push(data);

		// Set updated cart to local storage
		localStorage.setItem("foodCart", JSON.stringify(foodCart));
	}
}
