import { useSession, signIn, signOut } from "next-auth/react";
import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";
import Link from "next/link";



function userPage({userData}){

  const updatePassword = (event) =>{
    event.preventDefault();
    console.log("hello update password")
  }

  const updateAddress = (event) =>{
    event.preventDefault();
    console.log("hello update Address")
  }

  const updateContact = (event) =>{
    event.preventDefault();
    console.log("hello update contact")
  }

  const updateAltContact = (event) =>{
    event.preventDefault();
    console.log("hello update alt contact")
  }

  return(
    <>
      <div className= "w-1/2 flex flex-col justify-items-center text-center">
        <div className="text-5xl font-rale text-black font-bold p-8 text-center">
          <h1>Profile</h1>
        </div>
        <div className="rounded-md shadow-xl p-10 border-t border-t-gray-100">
          <form class="font-rale font-lg text-gray-800 font-bold">
            <label className= "label">First Name</label>
            <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" value={userData.firstName} id="forms-labelOverInputCode" disabled/>
            <label className= "label">Last Name</label>
            <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" value={userData.lastName} id="forms-labelOverInputCode" disabled />
            <label className= "label">Password</label>
            <div className="flex items-center">
              <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="password" value="Password" id="forms-labelOverInputCode" disabled />
              <label for="my-modal-1" class="btn btn-primary modal-button rounded-full ml-5 bg-green-500 hover:font-medium hover:bg-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>   
              </label> 
              <input type="checkbox" id="my-modal-1" class="modal-toggle"></input>           
              <div class="modal">
                <div class="modal-box">
                  <label className= "label">Enter New Password</label>
                  <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="password" id="forms-labelOverInputCode"/>
                  <label className= "label">Confirm Password</label>
                  <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="password" id="forms-labelOverInputCode"/>
                  <div className="modal-action">
                    <label for="my-modal-1" className="btn btn-primary font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300 right" onClick={updatePassword}>Save</label> 
                    <label for="my-modal-1" className="btn font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-red-500 hover:font-medium hover:bg-red-300 right">Cancel</label>
                  </div>
                </div>
              </div>
            </div>
            
            <label className= "label">Home Address</label>
            <div className="flex items-center">
              <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" value={userData.homeAddress} id="forms-labelOverInputCode" disabled/>
              <label for="my-modal-2" class="btn btn-primary modal-button rounded-full ml-5 bg-green-500 hover:font-medium hover:bg-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>   
              </label> 
              <input type="checkbox" id="my-modal-2" class="modal-toggle"></input>           
              <div class="modal">
                <div class="modal-box">
                  <label className= "label">Enter New Address</label>
                  <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="password" id="forms-labelOverInputCode"/>
                  <div className="modal-action">
                    <label for="my-modal-2" className="btn btn-primary font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300 right" onClick={updateAddress}>Save</label> 
                    <label for="my-modal-2" className="btn font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-red-500 hover:font-medium hover:bg-red-300 right">Cancel</label>
                  </div>
                </div>
              </div>
            </div>
      
            <label className= "label">Contact Number 1</label>
            <div className="flex items-center shrink-0">
              <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" value={userData.contactNum} id="forms-labelOverInputCode" disabled />
              <label for="my-modal-3" class="btn btn-primary modal-button rounded-full ml-5 bg-green-500 hover:font-medium hover:bg-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>   
              </label> 
              <input type="checkbox" id="my-modal-3" class="modal-toggle"></input>           
              <div class="modal">
                <div class="modal-box">
                  <label className= "label">Input New Contact Number</label>
                  <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="forms-labelOverInputCode"/>
                  <div className="modal-action">
                    <label for="my-modal-3" className="btn btn-primary font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300 right" onClick={updateContact}>Save</label> 
                    <label for="my-modal-3" className="btn font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-red-500 hover:font-medium hover:bg-red-300 right">Cancel</label>
                  </div>
                </div>
              </div>
            </div>
            
            <label className= "label">Contact Number 2</label>
            <div className="flex items-center">
              <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" value={userData.altContactNum} id="forms-labelOverInputCode" disabled />
              <label for="my-modal-4" class="btn btn-primary modal-button rounded-full ml-5 bg-green-500 hover:font-medium hover:bg-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>   
              </label> 
              <input type="checkbox" id="my-modal-4" class="modal-toggle"></input>           
              <div class="modal">
                <div class="modal-box">
                  <label className= "label">Enter New Alternative Contact Number</label>
                  <input className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" type="text" id="forms-labelOverInputCode"/>
                  <div className="modal-action">
                    <label for="my-modal-4" className="btn btn-primary font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300 right" onClick={updateAltContact}>Save</label> 
                    <label for="my-modal-4" className="btn font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-red-500 hover:font-medium hover:bg-red-300 right">Cancel</label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

    </>
  )
}

export default userPage


export async function getServerSideProps(context) {

  //todo: check for session within getServerSideprops so can dynamically fetch email for userData (hard to test since having logging in issue)

    await createConnection();
    const userData = await User.findOne({ email: "lorenzoquerol@gmail.com" }, { __v: false, cart: false }); //just have to change email here to session.email once we have a way to implement this.
    return {
      props: {
        userData: JSON.parse(JSON.stringify(userData))
      }, // will be passed to the page component as props
    }

}
