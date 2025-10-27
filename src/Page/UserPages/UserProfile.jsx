import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [profile, setProfile] = useState();
  const navigate = useNavigate();

  const getUserProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}user/profile`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      setProfile(res.data.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      const status = err.response?.status;

      if (status === 403) {
        alert("Login first to access profile");
      } else if (status === 401) {
        alert("Your session expired. Login again to continue");
      } else if (status === 404) {
        alert("You can't access this page");
      } else {
        alert("You have to login first");
      }
      navigate("/auth");
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center px-6 py-10">
      {profile ? (
        <div className="bg-[#222222] p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#1DCD9F]/20">
          <h1 className="text-3xl font-bold text-[#1DCD9F] mb-6 text-center">
            Profile
          </h1>

          <div className="space-y-4">
            <h3 className="text-lg">
              <span className="font-semibold text-[#1DCD9F]">Name:</span>{" "}
              {profile.name}
            </h3>
            <h3 className="text-lg">
              <span className="font-semibold text-[#1DCD9F]">Email:</span>{" "}
              {profile.email}
            </h3>
            <h3 className="text-lg">
              <span className="font-semibold text-[#1DCD9F]">Role:</span>{" "}
              Student
            </h3>
          </div>

          <div className="mt-8">
            {profile.enrolledCourseList && profile.enrolledCourseList.length > 0 ? (
              <Link
                to="/myCourse"
                className="block bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold py-2 px-4 rounded-lg text-center transition-all"
              >
                Enrolled Courses ({profile.enrolledCourseList.length})
              </Link>
            ) : (
              <div className="text-gray-400 text-center">
                You haven't enrolled in any course yet.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-center text-lg">
          Loading profile...
        </div>
      )}
    </div>
  );
}
