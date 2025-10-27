import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Nav() {

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

  return (
    <>
      <nav className="bg-black text-white px-6 py-3 shadow-md border-b border-[#1DCD9F]/30">
        <div className="flex items-center justify-between max-w-7xl mx-auto">

          {/* Brand name */}
          <Link
            className="text-[#1DCD9F] text-2xl font-extrabold tracking-wide hover:opacity-80 transition-all"
          >
            LearnHub
          </Link>

          {/* Navigation links */}
          <div className="flex items-center space-x-6">
            {sfsl ? (
              <>
                {role === "ROLE_USER" && (
                  <>
                    <Link to="/" className="hover:text-[#1DCD9F] transition-colors">Home</Link>
                    <Link to="/myCourse" className="hover:text-[#1DCD9F] transition-colors">My Learning</Link>
                    <Link to="/profile" className="hover:text-[#1DCD9F] transition-colors">Profile</Link>
                  </>
                )}

                {role === "ROLE_ADMIN" && (
                  <>
                    <Link to="/admin/addCourse" className="hover:text-[#1DCD9F] transition-colors">Add Course</Link>
                    <Link to="/admin/myCourse" className="hover:text-[#1DCD9F] transition-colors">My Course</Link>
                    <Link to="/admin/profile" className="hover:text-[#1DCD9F] transition-colors">Profile</Link>
                  </>
                )}

                {role === "ROLE_MASTER" && (
                  <>
                    <Link to="/manager/allUsers" className="hover:text-[#1DCD9F] transition-colors">Instructors</Link>
                    <Link to="/manager/allCourse" className="hover:text-[#1DCD9F] transition-colors">Courses</Link>
                    <Link to="/manager/profile" className="hover:text-[#1DCD9F] transition-colors">Profile</Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/auth" className="hover:text-[#1DCD9F] transition-colors">Sign Up / Sign In</Link>
                <Link to="/" className="hover:text-[#1DCD9F] transition-colors">Home</Link>
              </>
            )}
          </div>

          {/* Logout button */}
          {sfsl && (
            <button
              onClick={logout}
              className="ml-4 px-4 py-2 rounded-md bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold transition-all"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
