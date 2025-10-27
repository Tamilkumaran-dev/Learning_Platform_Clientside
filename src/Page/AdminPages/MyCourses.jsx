import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function MyCourses(){

    const[courses , setCourse] = useState();
    
        useEffect(()=>{
             const isLoggedIn = async()=>{
                try{
                    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}check/isLoggedIn`,{ headers: { "Content-Type": "application/json" },withCredentials : true})
                    console.log(res);
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
                    setCourse(res.data.data.courses);
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

    return(<>
        <div>
            <h2>My course</h2>
            <div>{courses && 
            (<ul>{courses.map((c)=>{
                return(
                    
                    <li>
                        <Link to={`/admin/selectCourse/${c.id}`}>
                        <h2>Title : {c.courseTitle}</h2>
                        <h3>about : {c.courseDes}</h3>
                        </Link>
                    </li>
                )
            })}</ul>)
        }</div>
        </div>
        </>)
}