import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"

export default function GetInstructor(){

    const{adminId} = useParams();
    const[admin,setAdmin] = useState(); 
    const navigate = useNavigate();

    const getInstructor = async()=>{
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}master/findAdmin/${adminId}`,{headers:{"Content-Type":"application/json"},withCredentials:true});
            setAdmin(res.data.data);
        }
        catch(err){
        console.log("error in fetching the admin");
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
        }}
    }

    useEffect(()=>{
        getInstructor();
    },[])

    const deleteMethod = async(id)=>{
        try{
            const res2 = await axios.delete(`${import.meta.env.VITE_BASE_URL}master/deleteAdmin/${id}`,{headers:{"Content-Type":"application/josn"},withCredentials:true});
            if(res2.data.resKeyword === "Deleted"){
                getInstructor();
            }
        }
        catch(err){
        console.log("delete caurse a error");
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
                <button onClick={()=>{navigate(-1)}}>Go back</button>
            {admin ?
            (<div>
               <div>
                  <button onClick={()=>{deleteMethod(admin.id)}}>Delete this Instructor</button>
                </div> 
                <h2>{admin.name}</h2>
                {(admin.courses != null && admin.courses.length > 0) ?
                (<div>
                    <h3>Course</h3>
                    <ul>
                        {admin.courses.map((c)=>{
                            return(
                            
                                <li>
                                <Link to={`/admin/selectCourse/${c.id}`}><h2>{c.courseTitle}</h2></Link>
                                <details>
                                    <h3>{c.courseDes}</h3>
                                </details>
                                </li>
                            )
                        })}
                    </ul>
                </div>)
                :
                (<div>
                    No course
                </div>)}
            </div>)
            :
            (<div>
                loading...
            </div>)}
            </div>
        </>
    )
}