import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectContent from "./SelectContent";

export default function SelectCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [courseStatus, setCourseStatus] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [SelectModule, setSelectModule] = useState();
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}user/getMyLearning`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.data !== null) {
        let foundCourse = null;
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].course.id == courseId) {
            foundCourse = res.data.data[i].course;
            setCourse(foundCourse);
            setCourseStatus(res.data.data[i].courseStatus);
            setEnrolled(true);
            setSelectModule(
              res.data.data[i].course.modules.length > 0
                ? res.data.data[i].course.modules[0].id
                : null
            );
            setIsCompleted(
              res.data.data[i].courseStatus != null
                ? res.data.data[i].courseStatus.modules.includes(
                    res.data.data[i].course.modules[0].id
                  )
                : false
            );
            break;
          }
        }

        if (!foundCourse) {
          const res2 = await axios.get(
            `${import.meta.env.VITE_BASE_URL}course/${courseId}`,
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          setCourse(res2.data.data);
          setEnrolled(false);
        }
      } else {
        const res2 = await axios.get(
          `${import.meta.env.VITE_BASE_URL}course/${courseId}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setCourse(res2.data.data);
        setEnrolled(false);
      }
    } catch (err) {
      console.log("Error fetching course:", err);
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

  useEffect(() => {
    fetchCourse();
  }, [courseId, navigate]);

  const enrollmethod = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}user/enrollCourse/${courseId}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      alert(res.data.message);
      fetchCourse();
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold rounded-lg transition-all"
      >
        Go Back
      </button>

      {enrolled ? (
        <div className="bg-[#222222] p-8 rounded-2xl shadow-lg border border-[#1DCD9F]/30">
          <h1 className="text-3xl font-bold text-[#1DCD9F] mb-3">
            {course?.courseTitle}
          </h1>
          <p className="text-gray-300 mb-6">{course?.courseDes}</p>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Modules */}
            <div className="w-full md:w-1/3 bg-[#000000] p-4 rounded-xl border border-[#1DCD9F]/20">
              <h3 className="text-xl font-semibold text-[#1DCD9F] mb-3">
                Modules
              </h3>
              {course?.modules.length > 0 ? (
                <ul className="space-y-3">
                  {course?.modules?.map((m) => (
                    <li
                      key={m.id}
                      onClick={() => {
                        setSelectModule(m.id);
                        if (courseStatus != null) {
                          setIsCompleted(courseStatus.modules.includes(m.id));
                        } else {
                          setIsCompleted(false);
                        }
                      }}
                      className={`cursor-pointer px-3 py-2 rounded-lg transition-all ${
                        SelectModule === m.id
                          ? "bg-[#1DCD9F] text-black"
                          : "hover:bg-[#1DCD9F]/10"
                      }`}
                    >
                      {m.moduleTitle}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-4">
                  No modules available in this course.
                </p>
              )}
            </div>

            {/* Module Content */}
            <div className="flex-1 bg-[#000000] p-4 rounded-xl border border-[#1DCD9F]/20">
              {SelectModule ? (
                <SelectContent
                  moduleId={SelectModule}
                  isCompleted={isCompleted}
                  isCompletedMethod={setIsCompleted}
                  courseId={courseId}
                />
              ) : (
                <p className="text-gray-400">Select a module to view content.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        course && (
          <div className="bg-[#222222] p-8 rounded-2xl shadow-lg border border-[#1DCD9F]/30">
            <h1 className="text-3xl font-bold text-[#1DCD9F] mb-3">
              {course.courseTitle}
            </h1>
            <p className="text-gray-300 mb-4">{course.courseDes}</p>
            <h3 className="text-[#1DCD9F] mb-6 font-semibold">
              Enroll to access content
            </h3>

            <button
              onClick={(e) => enrollmethod(e)}
              className="mb-6 px-6 py-2 bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold rounded-lg transition-all"
            >
              Enroll
            </button>

            {course.modules.length > 0 ? (
              <ul className="space-y-3">
                <h3 className="text-xl font-semibold text-[#1DCD9F] mb-3">
                  Modules
                </h3>
                {course.modules.map((m) => (
                  <li
                    key={m.id}
                    onClick={() =>
                      alert("You have to enroll first to view all the content")
                    }
                    className="p-3 rounded-lg bg-[#000000] border border-[#1DCD9F]/20 hover:bg-[#1DCD9F]/10 cursor-pointer"
                  >
                    <h2 className="font-semibold">{m.moduleTitle}</h2>
                    <details className="text-gray-400">
                      Description: {m.moduleDes}
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-4">
                No modules available in this course.
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
}
