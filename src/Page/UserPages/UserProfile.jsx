import axios from "axios"
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserProfile(){

    const [profile, setProfile] = useState();
    const navigate = useNavigate();

    const getUserProfile =async()=>{
        try{
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}user/profile`,{headers:{"Content-Type":"application/json"},withCredentials : true});
            setProfile(res.data.data);
        }
        catch(err){
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

    useEffect(()=>{
        getUserProfile();
    },[])


    return(<>
        {profile && (<div>
            <h1>Profile</h1>
            <h3>Name : {profile.name}</h3>
            <h3>Email : {profile.email}</h3>
            <h3>role : Student</h3>
            <div>
               {(profile.enrolledCourseList != null && profile.enrolledCourseList.length != 0) ?
               (<Link to = {`/myCourse`}>
                    <h3>
                        Enrolled Course
                    </h3>
                    <p>{profile.enrolledCourseList.length}</p>
               </Link>)
               :
               (<div>
                    <h3>You Have enrolled in an course</h3>
               </div>)}
            </div>
        </div>)}
    </>)
}