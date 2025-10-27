import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function GetInstructor() {
  const { adminId } = useParams();
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  const getInstructor = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}master/findAdmin/${adminId}`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      setAdmin(res.data.data);
    } catch (err) {
      console.log("Error fetching instructor:", err);
      const status = err.response?.status;

      if (status === 403) {
        alert("Login first to access this page");
        navigate("/auth");
      } else if (status === 401) {
        alert("Your session expired. Please login again.");
        navigate("/auth");
      } else if (status === 404) {
        alert("You can't access this page");
        navigate("/auth");
      } else {
        alert("Something went wrong. Please login again.");
        navigate("/auth");
      }
    }
  };

  useEffect(() => {
    getInstructor();
  }, []);

  const deleteMethod = async (id) => {
    try {
      const res2 = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}master/deleteAdmin/${id}`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (res2.data.resKeyword === "Deleted") {
        getInstructor();
      }
    } catch (err) {
      console.log("Error deleting instructor:", err);
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
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white py-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-[#222222] rounded-2xl shadow-lg border border-[#1DCD9F]/30 p-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#169976] hover:bg-[#1DCD9F] text-white px-4 py-2 rounded-lg transition-all"
          >
            ← Go Back
          </button>

          {admin && (
            <button
              onClick={() => deleteMethod(admin.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              Delete Instructor
            </button>
          )}
        </div>

        {admin ? (
          <div>
            <h2 className="text-3xl font-bold text-[#1DCD9F] mb-4">
              {admin.name}
            </h2>
            <p className="text-gray-300 mb-6">{admin.email}</p>

            {admin.courses && admin.courses.length > 0 ? (
              <div>
                <h3 className="text-2xl font-semibold text-[#1DCD9F] mb-4">
                  Courses
                </h3>
                <ul className="space-y-4">
                  {admin.courses.map((c) => (
                    <li
                      key={c.id}
                      className="bg-[#000000] border border-[#1DCD9F]/30 rounded-xl p-5 hover:bg-[#1DCD9F]/10 transition-all"
                    >
                      <Link
                        to={`/admin/selectCourse/${c.id}`}
                        className="text-[#1DCD9F] text-xl font-semibold hover:text-[#169976]"
                      >
                        {c.courseTitle}
                      </Link>
                      <details className="mt-2 text-gray-400">
                        <summary className="cursor-pointer text-[#1DCD9F]/70 hover:text-[#1DCD9F]">
                          Description
                        </summary>
                        <p className="mt-2">{c.courseDes}</p>
                      </details>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-gray-400 mt-6">No courses available</div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-lg mt-10 animate-pulse">
            Loading instructor details...
          </div>
        )}
      </div>
    </div>
  );
}
