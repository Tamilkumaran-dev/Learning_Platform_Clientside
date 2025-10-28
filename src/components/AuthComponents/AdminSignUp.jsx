import axios from "axios";
import { useState } from "react";




export default function AdminSignUp(props){
const { SignUpOrSignIn } = props;
const [userData,setUserData] = useState({});

const SignUpMethod = async(e)=>{
    e.preventDefault();
    try{
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/adminSignUp`, userData, {
            headers:{"Content-Type":"application/json"},
            withCredentials:true
        });
        alert(res.data.message);
        alert("now Login");
        SignUpOrSignIn(false);
    }
    catch(err){
        console.log(err)
        alert(err.response.data.message);
    }
}

return(
    <div>
        <form onSubmit={SignUpMethod} className="flex flex-col space-y-4">
            <label htmlFor="name" className="font-medium">Name</label>
            <input type="text" name="name" id="name" className="p-2 rounded-md bg-[#000000] border border-[#1DCD9F] text-white" onChange={(e)=>setUserData({...userData,[e.target.name]:e.target.value})} required/>
            <label htmlFor="email" className="font-medium">Email</label>
            <input type="email" name="email" id="email" className="p-2 rounded-md bg-[#000000] border border-[#1DCD9F] text-white" onChange={(e)=>setUserData({...userData,[e.target.name]:e.target.value})} required/>
            <label htmlFor="password" className="font-medium">Password</label>
            <input type="password" name="password" id="password" className="p-2 rounded-md bg-[#000000] border border-[#1DCD9F] text-white" onChange={(e)=>setUserData({...userData,[e.target.name]:e.target.value})} required/>
            <label htmlFor="conformPassword" className="font-medium">Confirm Password</label>
            <input type="text" name="conformPassword" id="conformPassword" className="p-2 rounded-md bg-[#000000] border border-[#1DCD9F] text-white"/>
            <input type="submit" value="Sign Up" className="mt-4 py-2 bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold rounded-md cursor-pointer"/>
        </form>
    </div>
)




}