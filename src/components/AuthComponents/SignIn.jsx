import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function SignIn(){
    
    const[loginDetials, setLoginDetails] = useState({});
    const navigate = useNavigate();

    const loginMethod = async(e)=>{
        console.log(loginDetials);
        e.preventDefault();
        try{
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/signIn`,loginDetials,{ headers: { "Content-Type": "application/json" },withCredentials : true});
       
            console.log(res.data.message);
            if(res.data.resKeyword === "ROLE_MASTER"){
                navigate("/manager/allCourse");
            }
            else if(res.data.resKeyword === "ROLE_ADMIN"){
                navigate("/admin/myCourse");
            }
            else{
                navigate("/");
            }

            

        }
        catch(err){
            console.log("login error")
            console.log(err);
            alert(err.response.data.message);
        }
    }

    return(<>
            <div>
                <form onSubmit={(e)=>{loginMethod(e)}}>
                    <input type="email" name="email" id="email" onChange={(e)=>{setLoginDetails({...loginDetials,[e.target.name] : e.target.value})}} required/>
                    <input type="password" name="password" id="password" onChange={(e)=>{setLoginDetails({...loginDetials,[e.target.name] : e.target.value})}} required/>
                    <input type="submit" value="Login"/>
                </form>
            </div>
            </>)
}