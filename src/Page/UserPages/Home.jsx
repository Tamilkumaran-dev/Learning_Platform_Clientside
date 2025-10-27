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
    <div style={{ padding: "20px" }}>
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
        style={{ padding: "8px", width: "250px", marginBottom: "20px" }}
      />

      <div>
        {courses.length > 0 ? (
          <ul>
            {courses.map((course, i) => {
              const daysOld =
                (new Date() - new Date(course.time)) / (1000 * 60 * 60 * 24);
              const isNew = daysOld < 30;

              return (
                <Link to={`/getCourse/${course.id}`}>
                <li
                  key={i}
                  style={{
                    marginBottom: "1.5rem",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "1rem",
                  }}
                >
                  <h3 style={{ color: "red" }}>{isNew ? "NEW 🔥" : ""}</h3>
                  <h2>Course: {course.courseTitle}</h2>
                  <p>{course.courseDes}</p>
                  <p>Modules: {course.modules?.length || 0}</p>
                </li>
                </Link>
              );
            })}
          </ul>
        ) : (
          <h2>No courses found</h2>
        )}
      </div>

      {/* Pagination Controls */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          style={{
            padding: "8px 16px",
            cursor: page === 1 ? "not-allowed" : "pointer",
            backgroundColor: page === 1 ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
        Prev
        </button>

        <span style={{ alignSelf: "center" }}>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          style={{
            padding: "8px 16px",
            cursor: page >= totalPages ? "not-allowed" : "pointer",
            backgroundColor: page >= totalPages ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
