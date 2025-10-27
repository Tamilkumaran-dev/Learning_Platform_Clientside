import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectContent(props) {
  const { moduleId, isCompleted, isCompletedMethod, courseId } = props;
  const [module, setModule] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getModule = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}course/module/${moduleId}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        let content = res.data.data.content;

        // ✅ Replace ImageUrl lines or <p> blocks with <img> tags
        content = content
          // handles <p>ImageUrl="..."</p>
          .replace(
            /<p>\s*ImageUrl\s*[:=]\s*["']?(https?:\/\/[^\s"']+)["']?\s*<\/p>/gi,
            '<img src="$1" alt="Module Image" class="rounded-lg my-4 shadow-md border border-[#1DCD9F]" />'
          )
          // handles inline or standalone ImageUrl: "..."
          .replace(
            /\bImageUrl\s*[:=]\s*["']?(https?:\/\/[^\s"']+)["']?/gi,
            '<img src="$1" alt="Module Image" class="rounded-lg my-4 shadow-md border border-[#1DCD9F]" />'
          );

        setModule({ ...res.data.data, content });
      } catch (err) {
        console.log(err);
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
          alert("Something went wrong");
          navigate("/auth");
        }
      }
    };
    getModule();
  }, [moduleId]);

  const MarkComplete = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}user/completeModule/${courseId}/${moduleId}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(res);
      isCompletedMethod(true);
    } catch (err) {
      console.log("Error completing the module", err);
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
    <div className="bg-[#000000] text-white p-6 rounded-2xl border border-[#1DCD9F]/30 shadow-lg transition-all">
      {module ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1DCD9F]">
            {module.moduleTitle}
          </h2>
          <h3 className="text-gray-300">{module.moduleDes}</h3>

          <div
            className="bg-[#222222] text-gray-200 p-4 rounded-xl border border-[#1DCD9F]/10"
            style={{ marginTop: 10 }}
            dangerouslySetInnerHTML={{ __html: module.content }}
          />

          <button
            onClick={() => MarkComplete()}
            disabled={isCompleted}
            className={`mt-4 px-6 py-2 rounded-lg font-semibold shadow-md transition-all ${
              isCompleted
                ? "bg-[#1DCD9F]/30 text-gray-400 cursor-not-allowed"
                : "bg-[#1DCD9F] hover:bg-[#169976] text-black"
            }`}
          >
            {isCompleted ? "Completed" : "Mark as Completed"}
          </button>
        </div>
      ) : (
        <div className="text-gray-400 text-center">Loading module...</div>
      )}
    </div>
  );
}
