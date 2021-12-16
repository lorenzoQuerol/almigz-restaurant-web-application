import { useSession, signIn, signOut } from "next-auth/react";
import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";


function userPage({userData}){
  return(
    <>
      <div>
        <form>
        <label className= "label">First Name</label>
            <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" value={userData.firstName} id="forms-labelOverInputCode" disabled/>
            <label className= "label">Last Name</label>
            <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" value={userData.lastName} id="forms-labelOverInputCode" disabled />
            <label className= "label">Password</label>
            <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="password" value="Password" id="forms-labelOverInputCode" disabled />
            <label className= "label">Home Address</label>
            <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" value={userData.homeAddress} id="forms-labelOverInputCode" disabled/>
            <label className= "label">Contact Number 1</label>
            <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" value={userData.contactNum} id="forms-labelOverInputCode" disabled />
            <label className= "label">Contact Number 2</label>
            <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" value={userData.altContactNum} id="forms-labelOverInputCode" disabled />
            <button className="font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300 right">Edit</button>
        </form>
      </div>

    </>
  )
}

export default userPage


export async function getServerSideProps(context) {
    await createConnection();
    const userData = await User.findOne({ email: "lorenzoquerol@gmail.com" }, { __v: false, cart: false });
    //const data = await response.json()
    console.log("hello");
    return {
      props: {
        userData: JSON.parse(JSON.stringify(userData))
      }, // will be passed to the page component as props
    }

}
