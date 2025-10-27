import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddModules() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [module, setModule] = useState({
    moduleTitle: "",
    moduleDes: "",
  });
  const [content, setContent] = useState("");
  const [addAnotherModule, setAddAnotherModule] = useState(false);

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}check/isLoggedIn`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (res.data.data === "ROLE_USER") {
          alert("You cannot access this page");
          navigate("/");
        }
      } catch {
        alert("Please login to access this page");
        navigate("/auth");
      }
    };
    isLoggedIn();
  }, [navigate]);

  const submitModule = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}admin/addModule/${courseId}`,
        { ...module, content },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      alert(res.data.message);
      setAddAnotherModule(true);
      setModule({ moduleTitle: "", moduleDes: "" });
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding module");
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-3xl bg-[#222222] p-8 rounded-2xl shadow-lg border border-[#1DCD9F]/30">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1DCD9F]">
            {addAnotherModule ? "Add Another Module" : "Add Module"}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm bg-[#1DCD9F]/20 text-[#1DCD9F] px-4 py-1.5 rounded-md hover:bg-[#1DCD9F]/40 transition-all"
          >
            Go Back
          </button>
        </div>

        <form
          onSubmit={submitModule}
          className="flex flex-col gap-5"
          autoComplete="off"
        >
          <div className="flex flex-col">
            <label
              htmlFor="moduleTitle"
              className="text-[#1DCD9F] font-semibold mb-2"
            >
              Module Title
            </label>
            <input
              type="text"
              name="moduleTitle"
              id="moduleTitle"
              value={module.moduleTitle}
              onChange={(e) =>
                setModule({ ...module, [e.target.name]: e.target.value })
              }
              required
              className="p-3 rounded-lg bg-[#000000] border border-[#1DCD9F]/40 focus:border-[#1DCD9F] outline-none text-white"
              placeholder="Enter module title"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="moduleDes"
              className="text-[#1DCD9F] font-semibold mb-2"
            >
              Module Description
            </label>
            <textarea
              name="moduleDes"
              id="moduleDes"
              rows="5"
              value={module.moduleDes}
              onChange={(e) =>
                setModule({ ...module, [e.target.name]: e.target.value })
              }
              required
              className="p-3 rounded-lg bg-[#000000] border border-[#1DCD9F]/40 focus:border-[#1DCD9F] outline-none text-white"
              placeholder="Write a short description..."
            ></textarea>
          </div>

          <div className="w-full text-black bg-white rounded-lg overflow-hidden border border-[#1DCD9F]/40">
            <CKEditor
              editor={ClassicEditor}
               data={content || `<h3>TO Add image your have to mention the url of the image like below example:</h3><p>ImageUrl:"https://community-cdn-digitalocean-com.global.ssl.fastly.net/vUuUtKqDrY9gAbaD2czK9KrN"</p><p>Your con't use ckEditor add image button,I am currently working on it.</p>`}
              onChange={(event, editor) => setContent(editor.getData())}
            />
          </div>

          <input
            type="submit"
            value="Add Module"
            className="cursor-pointer mt-4 py-2 px-6 bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold rounded-lg shadow-md transition-all"
          />
        </form>
      </div>
    </div>
  );
}
