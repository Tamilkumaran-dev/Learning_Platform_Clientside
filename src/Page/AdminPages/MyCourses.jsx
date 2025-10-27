import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourse] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}check/isLoggedIn`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      } catch (err) {
        const status = err.response?.status;
        if (status === 403) alert("Login first to access course");
        else if (status === 401) alert("Your session expired. Login again");
        else if (status === 404) alert("You can't access this page");
        else alert("Something went wrong");
        navigate("/auth");
      }
    };
    isLoggedIn();
  }, [navigate]);

  useEffect(() => {
    const getAdminProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}admin/profile`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setCourse(res.data.data.courses);
      } catch (err) {
        const status = err.response?.status;
        if (status === 403) alert("Login first to access course");
        else if (status === 401) alert("Your session expired. Login again");
        else if (status === 404) alert("You can't access this page");
        else alert("Something went wrong");
        navigate("/auth");
      }
    };
    getAdminProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#000000] text-white py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-[#222222] rounded-2xl shadow-lg border border-[#1DCD9F]/30 p-8">
        <h1 className="text-3xl font-bold text-[#1DCD9F] mb-8">My Courses</h1>

        {courses && courses.length > 0 ? (
          <ul className="space-y-6">
            {courses.map((c) => (
              <li
                key={c.id}
                className="bg-[#000000] border border-[#1DCD9F]/30 rounded-xl p-6 hover:bg-[#1DCD9F]/10 transition-all"
              >
                <Link to={`/admin/selectCourse/${c.id}`} className="block">
                  <h2 className="text-xl font-semibold text-[#1DCD9F] mb-2">
                    {c.courseTitle}
                  </h2>
                  <p className="text-gray-300">{c.courseDes}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-lg mt-6">
            You haven't created any courses yet.
          </p>
        )}
      </div>
    </div>
  );
}
