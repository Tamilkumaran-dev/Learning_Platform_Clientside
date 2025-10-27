import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";

export default function AddCourse(){
    
    const [course,setCourse] = useState();
    const navigate = useNavigate();
    const [savedCourse,setSavedCourse] = useState();
    

    useEffect(()=>{
        
                     const isLoggedIn = async()=>{
                        try{
                            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}check/isLoggedIn`,{ headers: { "Content-Type": "application/json" },withCredentials : true})
                            console.log(res.data.data);
                        }
                        catch(err){
                            console.log(err);
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


    const addCourseMethod = async(e)=>{
        e.preventDefault();
        try{
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}admin/createCourse`,course,{ headers: { "Content-Type": "application/json" },withCredentials : true})
            alert(res.data.message);
            setSavedCourse(res.data.data);
            
        }
        catch(err){
            console.log(err);
                if(err.response.status == 403){
                    alert("your are not allow to add a course");
                    navigate('/auth');
                }
                else if(err.response.status == 401){
                    alert("your are login expired please login again");
                    navigate('/auth');
                }
                else{
                    alert("something went wrong");
                    navigate('/auth');
                }

        }
    } 
    

    return(<>
        <div>   
               <h1> Create a New course</h1>
               <button onClick={()=>navigate(-1)}>Go back</button>
            <form onSubmit={(e)=>{addCourseMethod(e)}}>
                <label htmlFor="courseTitle">Title</label>
                <input type="text" name="courseTitle" id="courseTitle" onChange={(e)=>{setCourse({...course,[e.target.name] : e.target.value})}}/>
                <label htmlFor="courseDes">About</label>
                <textarea name="courseDes" id="courseDes" cols="30" rows="10" onChange={(e)=>{setCourse({...course,[e.target.name] : e.target.value})}}></textarea>
                <input type="submit" value="create a course"/>
            </form>
            <div>
                {savedCourse && <Link to={`/admin/addModule/${savedCourse.id}`}>Add Modules to course</Link>}
            </div>
        </div>
    </>)
}