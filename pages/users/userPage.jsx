import { useSession, signIn, signOut } from "next-auth/react";
import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";


function userPage({userData}){
  return(
    <>
      <div class="card lg:card-side bordered p-10">
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
            
          <input type="button" value="Input" class="btn"></input>
            
        </form>
      </div>

    </>
  )
}

export default userPage


export async function getServerSideProps(context) {

  //todo: check for session within getServerSideprops so can dynamically fetch email for userData

    await createConnection();
    const userData = await User.findOne({ email: "lorenzoquerol@gmail.com" }, { __v: false, cart: false });
    return {
      props: {
        userData: JSON.parse(JSON.stringify(userData))
      }, // will be passed to the page component as props
    }

}
