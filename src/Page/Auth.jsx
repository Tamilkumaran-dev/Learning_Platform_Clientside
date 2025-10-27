import { useState } from "react"
import UserSignUp from "../components/AuthComponents/UserSignUp";
import SignIn from "../components/AuthComponents/SignIn";
import SignUp from "../components/AuthComponents/SignUp";

export default function Auth(){
    
    const[SignUpOrSignIn, setSignUpOrSignIn] = useState(false);
    
    return(
        <>
            <div>
                
                {SignUpOrSignIn ? 
                <SignUp SignUpOrSignIn = {setSignUpOrSignIn}/>
                :
                <SignIn/>}
                <button onClick={()=>{setSignUpOrSignIn(!SignUpOrSignIn)}}>{SignUpOrSignIn ? "Sign In" : "Sign Up"}</button>
            </div>
        </>
    )
}