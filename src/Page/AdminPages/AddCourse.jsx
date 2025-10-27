import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddCourse() {
  const [course, setCourse] = useState();
  const [savedCourse, setSavedCourse] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}check/isLoggedIn`,
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        console.log(res.data.data);
      } catch (err) {
        console.log(err);
        const status = err.response?.status;
        if (status === 403) {
          alert("Login first to access course");
          navigate("/auth");
        } else if (status === 401) {
          alert("Your session expired, login again to continue");
          navigate("/auth");
        } else if (status === 404) {
          alert("You can't access this page");
          navigate("/auth");
        } else {
          alert("Something went wrong");
          navigate("/auth");
        }
      }
    };
    isLoggedIn();
  }, []);

  const addCourseMethod = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}admin/createCourse`,
        course,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      alert(res.data.message);
      setSavedCourse(res.data.data);
    } catch (err) {
      console.log(err);
      const status = err.response?.status;
      if (status === 403) {
        alert("You are not allowed to add a course");
        navigate("/auth");
      } else if (status === 401) {
        alert("Your login expired, please login again");
        navigate("/auth");
      } else {
        alert("Something went wrong");
        navigate("/auth");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-xl bg-[#222222] p-8 rounded-2xl shadow-lg border border-[#1DCD9F]/30">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1DCD9F]">Create a New Course</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm bg-[#1DCD9F]/20 text-[#1DCD9F] px-4 py-1.5 rounded-md hover:bg-[#1DCD9F]/40 transition-all"
          >
            Go Back
          </button>
        </div>

        <form onSubmit={addCourseMethod} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label htmlFor="courseTitle" className="text-[#1DCD9F] font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              name="courseTitle"
              id="courseTitle"
              onChange={(e) =>
                setCourse({ ...course, [e.target.name]: e.target.value })
              }
              className="p-3 rounded-lg bg-[#000000] border border-[#1DCD9F]/40 focus:border-[#1DCD9F] outline-none text-white"
              placeholder="Enter course title"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="courseDes" className="text-[#1DCD9F] font-semibold mb-2">
              About
            </label>
            <textarea
              name="courseDes"
              id="courseDes"
              rows="6"
              onChange={(e) =>
                setCourse({ ...course, [e.target.name]: e.target.value })
              }
              className="p-3 rounded-lg bg-[#000000] border border-[#1DCD9F]/40 focus:border-[#1DCD9F] outline-none text-white"
              placeholder="Write a short description..."
            ></textarea>
          </div>

          <input
            type="submit"
            value="Create Course"
            className="cursor-pointer mt-3 py-2 px-6 bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold rounded-lg shadow-md transition-all"
          />
        </form>

        {savedCourse && (
          <div className="mt-6 text-center">
            <Link
              to={`/admin/addModule/${savedCourse.id}`}
              className="text-[#1DCD9F] hover:underline hover:text-[#169976]"
            >
              Add Modules to this Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
