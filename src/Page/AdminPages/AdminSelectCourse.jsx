import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SelectModule from "../../components/CourseComponents/selectModule";

export default function AdminSelectCourse() {
  const [course, setCourse] = useState();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [moduleId, setModuleId] = useState();
  const [courseEditSwitch, setCourseEditSwitch] = useState(true);

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}check/isLoggedIn`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        console.log(res.data.data);
      } catch (err) {
        console.log(err);
        const status = err.response?.status;
        if (status === 403) alert("Login first to access course");
        else if (status === 401) alert("Session expired. Please login again");
        else if (status === 404) alert("You can't access this page");
        else alert("Something went wrong");
        navigate("/auth");
      }
    };
    isLoggedIn();
  });

  useEffect(() => {
    const getCourse = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}course/${courseId}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setCourse(res.data.data);
        setModuleId(res.data.data.modules.length > 0 ? res.data.data.modules[0].id : 0);
      } catch (err) {
        console.log("Error fetching course:", err);
        alert("Unable to load course");
        navigate("/auth");
      }
    };
    getCourse();
  }, [courseEditSwitch]);

  const submitCourseEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}admin/updateCourse/${courseId}`,
        course,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      alert(res.data.message);
      setCourseEditSwitch(true);
    } catch (err) {
      console.log(err);
      navigate("/auth");
    }
  };

  const deleteCourse = async (cId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}admin/deletedCourse/${cId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      alert("Successfully deleted");
      navigate(-1);
    } catch (err) {
      console.log("Error deleting course:", err);
      alert("Failed to delete course");
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white py-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-[#222222] p-8 rounded-2xl shadow-lg border border-[#1DCD9F]/30">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1DCD9F]">Admin Course Panel</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm bg-[#1DCD9F]/20 text-[#1DCD9F] px-4 py-1.5 rounded-md hover:bg-[#1DCD9F]/40 transition-all"
          >
            Go Back
          </button>
        </div>

        {course && (
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setCourseEditSwitch(!courseEditSwitch)}
                className="bg-[#1DCD9F] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#169976] transition-all"
              >
                {courseEditSwitch ? "Edit Course" : "Cancel"}
              </button>

              <Link
                to={`/admin/addModule/${courseId}`}
                className="bg-[#169976] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1DCD9F] transition-all"
              >
                Add Module
              </Link>

              <button
                onClick={() => deleteCourse(courseId)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                Delete Course
              </button>
            </div>

            {/* View or Edit Course */}
            {courseEditSwitch ? (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#1DCD9F] mb-2">
                  Title: <span className="text-white">{course.courseTitle}</span>
                </h2>
                <p className="text-gray-300 text-lg">
                  About: <span className="text-white">{course.courseDes}</span>
                </p>
              </div>
            ) : (
              <form onSubmit={submitCourseEdit} className="flex flex-col gap-4 mb-10">
                <div>
                  <label className="block text-[#1DCD9F] font-semibold mb-1">Course Title</label>
                  <input
                    type="text"
                    name="courseTitle"
                    value={course.courseTitle}
                    onChange={(e) =>
                      setCourse({ ...course, [e.target.name]: e.target.value })
                    }
                    className="w-full p-3 bg-[#000000] border border-[#1DCD9F]/40 rounded-lg focus:border-[#1DCD9F] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1DCD9F] font-semibold mb-1">
                    Course Description
                  </label>
                  <textarea
                    name="courseDes"
                    rows="6"
                    value={course.courseDes}
                    onChange={(e) =>
                      setCourse({ ...course, [e.target.name]: e.target.value })
                    }
                    className="w-full p-3 bg-[#000000] border border-[#1DCD9F]/40 rounded-lg focus:border-[#1DCD9F] outline-none"
                  ></textarea>
                </div>

                <input
                  type="submit"
                  value="Save Changes"
                  className="cursor-pointer py-2 px-6 bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold rounded-lg shadow-md transition-all"
                />
              </form>
            )}

            {/* Modules List */}
            {course.modules.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold text-[#1DCD9F] mb-3">Modules</h3>
                <ul className="flex flex-col gap-2">
                  {course.modules.map((m) => (
                    <li
                      key={m.id}
                      onClick={() => setModuleId(m.id)}
                      className={`cursor-pointer px-4 py-2 rounded-lg ${
                        moduleId === m.id
                          ? "bg-[#1DCD9F]/20 border border-[#1DCD9F]"
                          : "bg-[#000000] hover:bg-[#1DCD9F]/10"
                      } transition-all`}
                    >
                      <h4 className="text-white font-semibold">{m.moduleTitle}</h4>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <h3 className="text-gray-400 mt-6">No modules added yet.</h3>
            )}

            {/* Module Content */}
            <div className="mt-8">
              {moduleId > 0 ? (
                <SelectModule moduleId={moduleId} />
              ) : (
                <h2 className="text-gray-400">Select a module to view content.</h2>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
