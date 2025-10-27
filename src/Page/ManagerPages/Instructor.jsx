import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function Instructor(){
    
    const [users,setUsers] = useState();
    const [totalPages, setTotalPages] = useState(1);
    const [keyword, setKeyword] = useState("AllAdmin");
    const navigate = useNavigate();


    const getAllAdmin = async()=>{
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}master/getAdminUser/${keyword}/${1}/${10}`,{headers:{"Content-Type":"application/json"},withCredentials:true});
            setUsers(res.data.content);
            setTotalPages(res.data.totalPages || 1);
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
        getAllAdmin();
    },[keyword])

    const deleteMethod = async(id)=>{
        try{
            const res2 = await axios.delete(`${import.meta.env.VITE_BASE_URL}master/deleteAdmin/${id}`,{headers:{"Content-Type":"application/josn"},withCredentials:true});
            if(res2.data.resKeyword === "Deleted"){
                getAllAdmin();
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

            {users?.length > 0 ?
             (<div>
                <h2>Instructor</h2>
                <ul>
                    {users.map((u)=>{
                        return(
                            <li>
                                <h3>{u.name}</h3>
                                <h3>{u.email}</h3>

                                {(u.courses != null && u.courses.length > 0) ?
                                (<h3>Courses : {u.courses.length}<Link to={`/manager/getInstructor/${u.id}`}>view</Link></h3>)
                                :
                                (<h3>Not Courses</h3>)}
                                 <button onClick={()=>{deleteMethod(u.id)}}>Delete this Instructor</button>
                              
                            </li>
                        )
                    })}
                </ul>
             </div>)
            :
            (<div>
                <h3>No instructor</h3>
            </div>)}
        </>
    )
}