export default async function pushToCart(data) {
	let foodCart = new Array();
	if (localStorage.getItem("foodCart")) foodCart = JSON.parse(localStorage.getItem("foodCart"));

	for (var i = 0; i < foodCart.length; i++) {
		if (foodCart[i].data.productName == data.data.productName) {
			foodCart[i].qty = foodCart[i].qty + data.qty;
			break;
		}
	}

	if (i == foodCart.length) foodCart.push(data);
	localStorage.setItem("foodCart", JSON.stringify(foodCart));
}
