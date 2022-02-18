export default async function pushToCart(data) {
	if (typeof window !== "undefined") {
		// Get cart from local storage
		let cart = JSON.parse(localStorage.getItem("foodCart"));
		if (!cart) cart = { products: [], total: 0 };

		// Check if product already exists in cart; update quantity if found.
		let exists = false;
		cart.products.forEach((product) => {
			if (product.menuItem.productName === data.menuItem.productName && product.menuItem.category === data.menuItem.category) {
				product.quantity = Number(product.quantity) + Number(data.quantity);
				exists = true;
			}
		});

		// Else, push to cart
		if (!exists) cart.products.push(data);

		// Put the total into the array
		let total = 0;
		cart.products.forEach((product) => {
			total += Number(product.quantity) * Number(product.menuItem.productPrice);
		});

		let products = cart.products;
		const finalCart = { products, total };

		// Set updated cart to local storage
		localStorage.setItem("foodCart", JSON.stringify(finalCart));
	}
}
