import { useEffect, useState } from "react";
const getCart = () =>{
    const [foodCart, setFoodCart] = useState("");
    useEffect(() => {
        // Perform localStorage action
        foodCart = setFoodCart(JSON.parse(localStorage.getItem('foodCart')));
    }, [])
    const foodCartArr = new Array();


    // for (var i in foodCart)
    //     foodCartArr.push(foodCart[i]);
    for (var i in foodCart){
        var temp = new Array();
        temp.push(foodCart[i].menuItem.productName);
        temp.push(foodCart[i].quantity);
        foodCartArr.push(temp);
    }
    return foodCartArr;
}

export default getCart;