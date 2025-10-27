import { useState } from "react"
import AdminSignUp from "./AdminSignUp";
import UserSignUp from "./UserSignUp";

export default function SignUp(props){
    const [UserOrAdmin, setUserOrAdmin] = useState(false);
    
    
    return(<>
    <div>   
            <h2>{UserOrAdmin ?  "Course Creator Sign Up" : "User Sign Up"}</h2>
            {UserOrAdmin ? <AdminSignUp SignUpOrSignIn = {props.SignUpOrSignIn}/> : <UserSignUp SignUpOrSignIn = {props.SignUpOrSignIn}/>}
            <button onClick={()=>{setUserOrAdmin(!UserOrAdmin)}}>{UserOrAdmin ? "Switch User Sign Up" : "Switch to Course Creator Sign Up"}</button>
    </div>    
        </>)
}