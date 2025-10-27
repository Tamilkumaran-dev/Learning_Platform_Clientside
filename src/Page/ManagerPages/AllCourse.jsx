import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AllCourse() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHome = async () => {
    const searchValue = search.trim() === "" ? "allCourse" : search;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}home/search/${searchValue}/${page}/10`
      );

      setCourses(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchHome();
  }, [search, page]);

  return (
    <div className="min-h-screen bg-[#000000] text-white py-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-[#222222] rounded-2xl shadow-lg border border-[#1DCD9F]/30 p-8">
        <h1 className="text-3xl font-bold text-[#1DCD9F] mb-8 text-center">
          All Courses
        </h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="search"
            name="search"
            id="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search courses..."
            className="bg-[#000000] border border-[#1DCD9F]/40 text-white placeholder-gray-400 rounded-xl px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-[#1DCD9F]"
          />
        </div>

        {/* Course List */}
        <div>
          {courses.length > 0 ? (
            <ul className="space-y-6">
              {courses.map((course, i) => {
                const daysOld =
                  (new Date() - new Date(course.time)) / (1000 * 60 * 60 * 24);
                const isNew = daysOld < 30;

                return (
                  <Link to={`/admin/selectCourse/${course.id}`} key={i}>
                    <li className="bg-[#000000] border border-[#1DCD9F]/30 rounded-xl p-6 hover:bg-[#1DCD9F]/10 transition-all">
                      {isNew && (
                        <h3 className="text-[#1DCD9F] font-semibold mb-1">
                          NEW 🔥
                        </h3>
                      )}
                      <h2 className="text-2xl font-semibold text-[#1DCD9F] mb-2">
                        {course.courseTitle}
                      </h2>
                      <p className="text-gray-300 mb-2">{course.courseDes}</p>
                      <p className="text-sm text-gray-400">
                        Modules: {course.modules?.length || 0}
                      </p>
                    </li>
                  </Link>
                );
              })}
            </ul>
          ) : (
            <h2 className="text-gray-400 text-center mt-10 text-lg">
              No courses found
            </h2>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-all ${
              page === 1
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#169976] hover:bg-[#1DCD9F]"
            }`}
          >
            Prev
          </button>

          <span className="text-gray-300">
            Page <span className="text-[#1DCD9F]">{page}</span> of{" "}
            <span className="text-[#1DCD9F]">{totalPages}</span>
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-all ${
              page >= totalPages
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#169976] hover:bg-[#1DCD9F]"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
