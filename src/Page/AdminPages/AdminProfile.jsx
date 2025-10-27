import axios from "axios";
import { useEffect, useState } from "react"

export default function AdminProfile(){
    
    const[Profile , setProfile] = useState();

    useEffect(()=>{
         const isLoggedIn = async()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}check/isLoggedIn`,{ headers: { "Content-Type": "application/json" },withCredentials : true})
                console.log(res.data.data)
            }
            catch(err){
                if(err.response.status == 403){
                alert("Login first to access course");
                    navigate("/auth");
                }
                else if(err.response.status == 401){
                    alert("your session expired login again to continue");
                    navigate("/auth")
                }
                else if(err.response.status == 404){
                    alert("you can't access this page");
                    navigate("/auth")
                }
                else{
                    alert("Somthing went wrong",err.response.status);
                    navigate("/auth")
                }
            }
            
        }
        isLoggedIn();
    })

    useEffect(()=>{
        const getAdminProfile = async()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}admin/profile`,{ headers: { "Content-Type": "application/json" },withCredentials : true})
                setProfile(res.data.data);
            }
            catch(err){
                 if(err.response.status == 403){
                alert("Login first to access course");
                    navigate("/auth");
                }
                else if(err.response.status == 401){
                    alert("your session expired login again to continue");
                    navigate("/auth")
                }
                else if(err.response.status == 404){
                    alert("you can't access this page");
                    navigate("/auth")
                }
                else{
                    alert("Somthing went wrong check the console",err.response.status);
                    navigate("/auth")
                }

            }
            
        }
        getAdminProfile();
    },[]);


    return(
        <>
            {Profile && 
            (<div>
                <h3>name : {Profile.name}</h3>
                <h3>email : {Profile.email}</h3>
                <h3>courses : {Profile.courses.length}</h3>
            </div>)}
        </>
    )
}