import { useState, useEffect } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";

export default function Nav(){

    const [sfsl, setSfsl] = useState(false); 
    const [role, setRole] = useState("ROLE_USER");
     const navigate = useNavigate(); 

    useEffect(() => {
    isLoggedIn();

    const interceptor = axios.interceptors.response.use(
      (response) => {
        if (!response.config.url.includes("check/isLoggedIn")) {
          isLoggedIn();
        }
        return response;
      },
      (error) => {
        if (
          error.config &&
          error.config.url &&
          !error.config.url.includes("check/isLoggedIn")
        ) {
          isLoggedIn();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);


  const isLoggedIn = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}check/isLoggedIn`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (res.data.resStatus) {
        setSfsl(true);
        setRole(res.data.data);
      } else {
        setSfsl(false);
        setRole("ROLE_USER");
      }
    } catch (err) {
      console.log("error thrown for the nav isLoggedIn method :: ", err);
      setSfsl(false);
      setRole("ROLE_USER");
    }
  };

  const logout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}auth/logout`,
        {},
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (res.data.resStatus) {
        navigate("/auth");
        alert(res.data.message);
        setSfsl(false);
        setRole("ROLE_USER");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Logout failed");
      setSfsl(false);
      setRole("ROLE_USER");
    }
  };


    return(
        <>  
            <nav>
                {(sfsl) ? 
                (<div>
                    {role === "ROLE_USER" ? 
                    (<div>
                        
                         <Link to={"/"}>Home</Link>
                         <Link to={'/myCourse'}>My Learning</Link>
                         <Link to={'/profile'}>Profile</Link>
                    </div>)
                    :
                    ( role === "ROLE_ADMIN" ?
                    (<div>
                         <Link to={'/admin/addCourse'}>Add course</Link>
                         <Link to={'/admin/myCourse'}>My Course</Link>
                         <Link to={'/admin/profile'}>Profile</Link>
                    </div>)
                    :
                    (
                       (role === "ROLE_MASTER") ?
                       (<div>
                            <Link to={`/manager/allUsers`}>Instructors</Link>
                            <Link to={'/manager/allCourse'}>Courses</Link>
                            <Link to={'/manager/profile'}>Profile</Link>
                       </div>)
                       :
                       (<div>
                            no role
                       </div>) 
                    ))
                    }
                </div>)
                :
                (<div>
                    <Link to={'/auth'}>Sign Up / Sign In</Link>
                    <Link to={'/'}>Home</Link>
                </div>)
                }
                 {sfsl && (
                 <button onClick={logout}>
                    Logout
                 </button>
                )}
            </nav>
        </>
    )

}