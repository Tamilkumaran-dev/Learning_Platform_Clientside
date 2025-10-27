import { useState } from "react"
import UserSignUp from "../components/AuthComponents/UserSignUp";
import SignIn from "../components/AuthComponents/SignIn";
import SignUp from "../components/AuthComponents/SignUp";




export default function Auth(){
const [SignUpOrSignIn, setSignUpOrSignIn] = useState(false);

return(
    <>
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            <div className="bg-[#222222] p-8 rounded-2xl shadow-lg w-full max-w-md">
                {SignUpOrSignIn ? 
                <SignUp SignUpOrSignIn={setSignUpOrSignIn}/>
                :
                <SignIn/>}
                <button 
                    onClick={()=>{setSignUpOrSignIn(!SignUpOrSignIn)}}
                    className="mt-6 w-full py-2 rounded-md bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold transition-all">
                    {SignUpOrSignIn ? "Sign In" : "Sign Up"}
                </button>
            </div>
        </div>
    </>
)




}