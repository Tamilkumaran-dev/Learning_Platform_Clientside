import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MyCourse() {
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyCourse();
  }, []);

  const getMyCourse = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}user/getMyLearning`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      setMyCourses(res.data.data);
    } catch (err) {
      console.error("Error in getting the my course:", err);

      const status = err.response?.status;
      if (status === 403) {
        alert("Login first to access course");
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

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {myCourses && myCourses.length > 0 ? (
          <div>
            <h1 className="text-2xl font-bold text-[#1DCD9F] mb-6">My Courses</h1>
            <ul className="space-y-4">
              {myCourses.map((c, i) => (
                <li
                  key={i}
                  className="bg-[#222222] p-4 rounded-lg hover:shadow-lg transition-all"
                >
                  <Link to={`/getCourse/${c.course.id}`}>
                    <h2 className="text-lg font-semibold text-[#1DCD9F] hover:text-[#169976] transition-colors">
                      Title: {c.course.courseTitle}
                    </h2>
                    <p className="mt-2 text-gray-300">
                      Module Progress:{" "}
                      {c.courseStatus?.modules?.length || 0} / {c.course.modules?.length || 0}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-10">
            You haven't enrolled in any course yet.
          </div>
        )}
      </div>
    </div>
  );
}
