import axios from "axios"
import { useEffect } from "react"

export default function IsLoggin(){
    
    useEffect(()=>{
        const  isLogginMethod = async()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}check/isLoggedIn`,{ headers: { "Content-Type": "application/json" },withCredentials : true});
                console.log(res.data);
            }catch(err){
                console.log(err.response);
            }
             
        }

        isLogginMethod();
    },[])

    
    return(
        <>
            isLoggin
        </>
    )
}