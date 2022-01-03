export default async function pushToCart(data) {
  let foodCart = new Array();
  if (localStorage.getItem('foodCart')) foodCart = JSON.parse(localStorage.getItem('foodCart'));

  for (var i = 0; i < foodCart.length; i++) {
    if (foodCart[i].menuItem.productName == data.productName) {
      foodCart[i].menuItem.quantity = foodCart[i].menuItem.quantity + data.quantity;
      break;
    }
  }

  if (i == foodCart.length) foodCart.push(data);
  localStorage.setItem('foodCart', JSON.stringify(foodCart));
}
