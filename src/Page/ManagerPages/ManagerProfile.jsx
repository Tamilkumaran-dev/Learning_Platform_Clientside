import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function ManagerProfile(){
    
    const[profile,setProfile] = useState();
    const navigate = useNavigate();

    const getProfile = async()=>{
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}master/profile`,{headers:{"Content-Type":"application/json"},withCredentials:true})
            setProfile(res.data.data);
        }   
        catch(err){
        console.log("error in fetch manager profile");
        console.log(err);
        const status = err.response?.status;

        if (status === 403) {
          alert("Login first to access course");
          navigate("/auth");
        } else if (status === 401) {
          alert("Your session expired. Login again to continue");
          navigate("/auth");
        } else if (status === 404) {
          alert("You can't access this page");
          navigate("/auth");
        } else {
          alert("You have to login first");
          navigate("/auth");
        }
        }
    }

    useEffect(()=>{
        getProfile();
    },[])
    
    return(<>
        <div>
            {profile && 
            (<div>
                <h1>Profile</h1>
                <h3>Name : {profile.name}</h3>
                <h3>email : {profile.email}</h3>
                <h3>Role : Manager</h3>
            </div>)}
        </div>
    </>)
}