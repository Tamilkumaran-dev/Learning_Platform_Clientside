import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Instructor() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("AllAdmin");
  const navigate = useNavigate();

  const getAllAdmin = async (pageNum = page) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}master/getAdminUser/${keyword}/${pageNum}/10`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUsers(res.data.content);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log("Error in fetching the admin", err);
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
    getAllAdmin(page);
  }, [keyword, page]);

  const deleteMethod = async (id) => {
    try {
      const res2 = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}master/deleteAdmin/${id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res2.data.resKeyword === "Deleted") {
        getAllAdmin(page);
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

  // Handle pagination click
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white py-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-[#222222] rounded-2xl shadow-lg border border-[#1DCD9F]/30 p-8">
        <h2 className="text-3xl font-bold text-[#1DCD9F] mb-8 text-center">
          Instructors
        </h2>

        {users?.length > 0 ? (
          <>
            <ul className="space-y-6">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="bg-[#000000] border border-[#1DCD9F]/30 rounded-xl p-6 hover:bg-[#1DCD9F]/10 transition-all"
                >
                  <h3 className="text-xl font-semibold text-[#1DCD9F]">
                    {u.name}
                  </h3>
                  <p className="text-gray-300 mb-2">{u.email}</p>

                  {u.courses && u.courses.length > 0 ? (
                    <p className="text-gray-400 mb-3">
                      Courses:{" "}
                      <span className="text-[#1DCD9F] font-semibold">
                        {u.courses.length}
                      </span>{" "}
                      |{" "}
                      <Link
                        to={`/manager/getInstructor/${u.id}`}
                        className="text-[#1DCD9F] underline hover:text-[#169976]"
                      >
                        View
                      </Link>
                    </p>
                  ) : (
                    <p className="text-gray-500 mb-3">No Courses Assigned</p>
                  )}

                  <button
                    onClick={() => deleteMethod(u.id)}
                    className="bg-[#169976] hover:bg-[#1DCD9F] text-white px-4 py-2 rounded-lg font-medium transition-all"
                  >
                    Delete Instructor
                  </button>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  page === 1
                    ? "bg-[#1DCD9F]/20 text-gray-500 cursor-not-allowed"
                    : "bg-[#1DCD9F] hover:bg-[#169976] text-black"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    page === i + 1
                      ? "bg-[#169976] text-black"
                      : "bg-[#1DCD9F]/30 text-white hover:bg-[#1DCD9F]/60"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  page === totalPages
                    ? "bg-[#1DCD9F]/20 text-gray-500 cursor-not-allowed"
                    : "bg-[#1DCD9F] hover:bg-[#169976] text-black"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 text-lg mt-10">
            No instructors found
          </div>
        )}
      </div>
    </div>
  );
}
