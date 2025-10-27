import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import SelectModule from "../../components/CourseComponents/selectModule";
import { Button } from "bootstrap";

export default function AdminSelectCourse(){
     
    const[course , setCourse] = useState();
    const{courseId} = useParams();
    const navigate = useNavigate();
    const [moduleId,setModuleId] = useState();
    const [courseEditSwitch ,setCourseEditSwitch] = useState(true);

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
        
            useEffect(()=>{
                const getCourse = async()=>{
                    try{
                        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}course/${courseId}`,{ headers: { "Content-Type": "application/json" },withCredentials : true})
                        setCourse(res.data.data);
                        console.log("running")
                        setModuleId(res.data.data.modules.length > 0 ? res.data.data.modules[0].id : 0);
                    }
                    catch(err){
                        console.log("error in fetching");
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
                            alert("Somthing went wrong check the console",err.response.status);
                            navigate("/auth")
                        }
        
                    }
                    
                }
                getCourse();
            },[courseEditSwitch]);

        
            const submitCourseEdit = async(e)=>{
                e.preventDefault();
                try{
                    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}admin/updateCourse/${courseId}`,course,{ headers: { "Content-Type": "application/json" },withCredentials : true});
                    alert(res.data.message);
                    setCourseEditSwitch(true);
                }
                catch(err){
                    console.log(err);
                    navigate("/auth");
                }
            }

            const deleteCourse = async(cId)=>{
                try{
                   await axios.delete(`${import.meta.env.VITE_BASE_URL}admin/deletedCourse/${cId}`,{headers:{"Content-Type":"application/json"},withCredentials:true});
                     alert("successfully deleted")
                     navigate(-1);
                  }
                 catch(err){
                          console.log("error in deleting");
                          console.log(err);
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
    


    return(
        <>
            <div>
                <button onClick={()=>{navigate(-1)}}>Go Back</button>
                {course 
                    && 
                    (<div>
                        {<button onClick={()=>{setCourseEditSwitch(!courseEditSwitch);}}>{courseEditSwitch ? "Edit Course" : "cancel"}</button>}
                        {<Link to={`/admin/addModule/${courseId}`} >Add Module</Link>}
                        <button onClick={()=>{deleteCourse(courseId)}}>Delete the Course</button>
                        {courseEditSwitch ?
                        (<div> 
                            <h1>Title : {course.courseTitle}</h1>
                            <h2>About : {course.courseDes}</h2>
                        </div>)
                        :
                        (<div>
                            <form onSubmit={(e)=>{submitCourseEdit(e)}}>
                                <label htmlFor="courseTitle">Course Title</label>
                                <input type="text" name="courseTitle" id="" value={course.courseTitle} onChange={(e)=>setCourse({...course,[e.target.name]:e.target.value})}/>
                                <label htmlFor="courseDes">Course Descreption</label>
                                <textarea name="courseDes" id="" cols="30" rows="10" value={course.courseDes} onChange={(e)=>setCourse({...course,[e.target.name]:e.target.value})} ></textarea>
                                <input type="submit" value="save"/>
                            </form>
                        </div>)
                        }
                        {course.modules.length > 0 
                        &&
                        <ul>
                        {course.modules.map((m)=>{
                            return(
                                <li onClick={()=>{setModuleId(m.id)}}>
                                    <h3>{m.moduleTitle}</h3>
                                </li>
                            )
                        })}
                        </ul>}
                        <div>
                            {moduleId > 0 ? 
                            (<SelectModule moduleId={moduleId}/>)
                            :
                            (<h2>No module</h2>)
                            }
                        </div>
                    </div>)
                }
            </div>
        </>
    )
}