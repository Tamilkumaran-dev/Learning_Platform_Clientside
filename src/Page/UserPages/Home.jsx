import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1); // starts from 1 (frontend-friendly)
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
  }, [search, page]); // re-fetch when search or page changes

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input
            type="search"
            name="search"
            id="search"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset to first page when searching
            }}
            value={search}
            placeholder="Search courses..."
            className="w-full sm:w-64 p-2 rounded-md bg-[#000000] border border-[#1DCD9F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#169976]"
          />
          <div className="text-sm text-gray-300">
            Showing results — Page {page} of {totalPages}
          </div>
        </div>

        <div>
          {courses.length > 0 ? (
            <ul className="space-y-4">
              {courses.map((course, i) => {
                const daysOld =
                  (new Date() - new Date(course.time)) / (1000 * 60 * 60 * 24);
                const isNew = daysOld < 30;

                return (
                  <Link
                    to={`/getCourse/${course.id}`}
                    key={course.id ?? i}
                    className="block"
                  >
                    <li
                      className="bg-[#222222] p-4 rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-sm font-semibold text-[#1DCD9F]">
                        {isNew ? "NEW 🔥" : ""}
                      </h3>
                      <h2 className="text-lg font-bold mt-1">Course: {course.courseTitle}</h2>
                      <p className="mt-2 text-gray-200">{course.courseDes}</p>
                      <p className="mt-2 text-sm text-gray-400">
                        Modules: {course.modules?.length || 0}
                      </p>
                    </li>
                  </Link>
                );
              })}
            </ul>
          ) : (
            <h2 className="text-center text-gray-400">No courses found</h2>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-md text-white font-medium transition-all ${
              page === 1
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#1DCD9F] hover:bg-[#169976] text-black"
            }`}
          >
            Prev
          </button>

          <span className="text-sm text-gray-300">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-md text-white font-medium transition-all ${
              page >= totalPages
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#1DCD9F] hover:bg-[#169976] text-black"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
