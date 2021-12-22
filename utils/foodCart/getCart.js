const getCart = () =>{
    const foodCart = JSON.parse(localStorage.getItem('foodCart'))
    
    var total = 0
    if(foodCart){
        for (var i = 0; i < foodCart.length; i++)
        total += foodCart[i].data.productPrice * foodCart[i].qty
    }
    return {data:foodCart, total:total} ;
    


}

export default getCart;