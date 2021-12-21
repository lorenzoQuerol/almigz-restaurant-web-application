const pushToCart = async (data) =>  {
    if(localStorage.getItem("foodCart"))
        var foodCart = JSON.parse(localStorage.getItem("foodCart"));
    else
        var foodCart = new Array();

    for (var i = 0; i < foodCart.length; i++){
        console.log(data.qty)
        console.log(foodCart[i].qty)
        if(foodCart[i].data.productName == data.data.productName){
            foodCart[i].qty = foodCart[i].qty + data.qty;
            break;
        } 
    }

    

    if(0 == foodCart.length)
        foodCart.push(data);
        
    console.log(foodCart[0].qty)
    console.log(foodCart)
    localStorage.setItem("foodCart", JSON.stringify(foodCart));
    // console.log(JSON.parse(localStorage.getItem("foodCart")));
    //localStorage.clear()
    
};

export default pushToCart;