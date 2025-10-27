import { useState } from "react";
import AdminSignUp from "./AdminSignUp";
import UserSignUp from "./UserSignUp";


export default function SignUp(props){
const [UserOrAdmin, setUserOrAdmin] = useState(false);

return(
    <div>
        <h2 className="text-center text-2xl font-semibold mb-6">{UserOrAdmin ?  "Course Creator Sign Up" : "User Sign Up"}</h2>
        {UserOrAdmin ? <AdminSignUp SignUpOrSignIn={props.SignUpOrSignIn}/> : <UserSignUp SignUpOrSignIn={props.SignUpOrSignIn}/>}
        <button 
            onClick={()=>{setUserOrAdmin(!UserOrAdmin)}}
            className="mt-6 w-full py-2 rounded-md bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold transition-all">
            {UserOrAdmin ? "Switch User Sign Up" : "Switch to Course Creator Sign Up"}
        </button>
    </div>
)

}