import axios from "axios";
import bcrypt from "bcryptjs"
async function uploadToDb(userData){

    async function hash (password){
        var salt = bcrypt.genSaltSync(12);
        var hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    }
    userData.password = await hash(userData.password)
    
    
    const options = {
        method: "POST",
        url: "http://localhost:3000/api/users",
        header: {'Content-type': 'application/json', Authorization:'Bearer undefined'},
        data:userData
    };
    await axios.request(options)
    .then(response => {
        console.log(response.request.statusText)
        alert (response.request.statusText);
    })
    .catch(err => {
        if(JSON.parse(err.request.responseText)["msg"].message){
            alert (JSON.parse(err.request.responseText)["msg"].message)
        }else if (JSON.parse(err.request.responseText)["msg"]){
            alert (JSON.parse(err.request.responseText)["msg"])
        }
        else{
            return(err)
        }
        
    })
}
export default uploadToDb