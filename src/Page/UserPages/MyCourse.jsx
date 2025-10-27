import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";


export default function MyCourse(){
    
    const [myCourses,setMyCourses]= useState();
    const navigate = useNavigate();


    useEffect(()=>{ 
    getMyCourse();
    },[])

      const getMyCourse = async()=>{
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}user/getMyLearning`,{headers:{"Content-Type":"application/json"},withCredentials:true})
            setMyCourses(res.data.data);
        
        }catch(err){
            console.log("error in getting the my course")
            console.log(err)
           console.log("this is the err");
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
                {myCourses ? 
                (<div>
                    <h1>My Courses</h1>
                    <ul>
                    {myCourses.map((c)=>{
                        
                        return(
                            <li>
                            <Link to={`/getCourse/${c.course.id}`}>    
                                <h2>Tiltle : {c.course.courseTitle}</h2>
                                <p>module : {c.course.modules.length} / {(c.courseStatus != null ? (c.courseStatus.modules != null ? (c.courseStatus.modules.length): 0 ) : 0  )}</p>
                            </Link>
                            </li>
                        )

                    })}
                    </ul>
                </div>) 
                : 
                (<div>
                    Your haven't enrolled in any course
                </div>)}
            </div>
        </>
    )
}