import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";




export default function SignIn(){
const [loginDetials, setLoginDetails] = useState({});
const navigate = useNavigate();

const loginMethod = async(e)=>{
    e.preventDefault();
    try{
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/signIn`, loginDetials, {
            headers: { "Content-Type": "application/json" },
            withCredentials : true
        });
        if(res.data.resKeyword === "ROLE_MASTER"){
            navigate("/manager/allCourse");
        } else if(res.data.resKeyword === "ROLE_ADMIN"){
            navigate("/admin/myCourse");
        } else {
            navigate("/");
        }
    }
    catch(err){
        console.log(err);
        alert(err.response.data.message);
    }
}

return(
    <div>
        <form onSubmit={loginMethod} className="flex flex-col space-y-4">
            <input type="email" name="email" id="email" placeholder="Email" className="p-2 rounded-md bg-[#000000] border border-[#1DCD9F] text-white" onChange={(e)=>setLoginDetails({...loginDetials,[e.target.name]:e.target.value})} required/>
            <input type="password" name="password" id="password" placeholder="Password" className="p-2 rounded-md bg-[#000000] border border-[#1DCD9F] text-white" onChange={(e)=>setLoginDetails({...loginDetials,[e.target.name]:e.target.value})} required/>
            <input type="submit" value="Login" className="mt-4 py-2 bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold rounded-md cursor-pointer"/>
        </form>
    </div>
)




}