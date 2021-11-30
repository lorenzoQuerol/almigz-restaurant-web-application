import axios from "axios";
import bcrypt from "bcryptjs"


async function loginRequest(inputData){
    const options = {
        method: "GET",
        url: "http://localhost:3000/api/users",
        header: {'Content-type': 'application/json', Authorization:'Bearer undefined'},
    };
    
    
    await axios.request(options)
    .then(async response => {
        var dbData = response["data"]["data"]       //data base return DATA
        var inputPassword = inputData["password"]   //user password input
        var inputEmail = inputData["email"]         //user email input
        var userExists = false                      
        for(var i=0; i < dbData.length; i++){       //scan through all the db data
            if(inputEmail == dbData[i]["email"]){   //check if an email matches
                userExists = true
                //verify input password
                await bcrypt.compare(inputPassword, dbData[i]["password"], function(err, res) {
                    if(res)
                        //if password input matches do this
                        alert(res)
                    else
                        alert("Login Error, Account does not Exist")
                    console.log(i)
                })
            }
        }
        if(!userExists){
            alert("Login Error, Account does not Exist")
        }
        
    })
    .catch(err => {
        console.log(err)
    })
}
export default loginRequest