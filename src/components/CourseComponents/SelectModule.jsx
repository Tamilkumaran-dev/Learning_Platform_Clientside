import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function SelectModule({ moduleId }) {
  const [module, setModule] = useState(null);
  const [editModule, setEditModule] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}check/isLoggedIn`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      } catch (err) {
        alert("Please login to access this page");
      }
    };
    isLoggedIn();
  }, []);

  useEffect(() => {
    getModule();
  }, [moduleId, editModule]);

  const getModule = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}course/module/${moduleId}`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      let content = res.data.data.content;

      // ✅ Replace ImageUrl with actual image tags
      content = content
        .replace(
          /<p>\s*ImageUrl\s*[:=]\s*["']?(https?:\/\/[^\s"']+)["']?\s*<\/p>/gi,
          '<img src="$1" alt="Module Image" class="rounded-lg my-4 shadow-md border border-[#1DCD9F]" />'
        )
        .replace(
          /\bImageUrl\s*[:=]\s*["']?(https?:\/\/[^\s"']+)["']?/gi,
          '<img src="$1" alt="Module Image" class="rounded-lg my-4 shadow-md border border-[#1DCD9F]" />'
        );

      setModule({ ...res.data.data, content });
    } catch (err) {
      console.error("Error fetching module:", err);
      alert("Something went wrong while loading the module.");
    }
  };

  const submitModule = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}admin/updateModule/${moduleId}`,
        { ...module },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      alert(res.data.message || "Module updated successfully!");
      setEditModule(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating the module.");
    }
  };

  const deleteModule = async (mId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}admin/deletedModule/${mId}`,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      alert("Module deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete module.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-black text-white rounded-xl shadow-lg mt-10 border border-[#1DCD9F]/30">
      {/* Header Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-x-4">
          <button
            onClick={() => setEditModule(!editModule)}
            className="px-5 py-2 rounded-md bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold transition-all"
          >
            {editModule ? "Edit Module" : "Cancel"}
          </button>
          <button
            onClick={() => deleteModule(moduleId)}
            className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
          >
            Delete Module
          </button>
        </div>
      </div>

      {/* Module Content */}
      {editModule ? (
        module ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1DCD9F]">
              Title: <span className="text-white">{module.moduleTitle}</span>
            </h2>
            <h3 className="text-lg">
              About: <span className="text-gray-300">{module.moduleDes}</span>
            </h3>

            <h3 className="text-xl font-semibold mt-6 text-[#1DCD9F]">Content</h3>
            <details open className="bg-[#111] p-4 rounded-lg border border-[#1DCD9F]/30">
              <div
                className="rendered-content"
                dangerouslySetInnerHTML={{ __html: module.content }}
              />
            </details>
          </div>
        ) : (
          <p className="text-gray-400">Loading module...</p>
        )
      ) : (
        <form onSubmit={submitModule} className="flex flex-col gap-4 mt-4">
          <label htmlFor="moduleTitle" className="font-semibold text-[#1DCD9F]">
            Module Title
          </label>
          <input
            type="text"
            name="moduleTitle"
            id="moduleTitle"
            value={module?.moduleTitle || ""}
            onChange={(e) => setModule({ ...module, [e.target.name]: e.target.value })}
            required
            className="p-3 bg-[#111] border border-[#1DCD9F]/40 rounded-md focus:outline-none focus:border-[#1DCD9F]"
          />

          <label htmlFor="moduleDes" className="font-semibold text-[#1DCD9F]">
            Module Description
          </label>
          <textarea
            name="moduleDes"
            id="moduleDes"
            cols="30"
            rows="5"
            value={module?.moduleDes || ""}
            onChange={(e) => setModule({ ...module, [e.target.name]: e.target.value })}
            required
            className="p-3 bg-[#111] border border-[#1DCD9F]/40 rounded-md focus:outline-none focus:border-[#1DCD9F]"
          ></textarea>

          <div className="text-black bg-white rounded-md p-2">
            <CKEditor
              editor={ClassicEditor}
              data={module?.content || `<h2>To Add image your have to mention the url of the image like below example:</h2></br><p>ImageUrl:"https://community-cdn-digitalocean-com.global.ssl.fastly.net/vUuUtKqDrY9gAbaD2czK9KrN"</p></br><p>Your con't use ckEditor add image button,I am currently working on it.</p>`}
              onChange={(event, editor) =>
                setModule({ ...module, content: editor.getData() })
              }
            />
          </div>

          <input
            type="submit"
            value="Save Changes"
            className="px-6 py-3 rounded-md bg-[#1DCD9F] hover:bg-[#169976] text-black font-semibold mt-4 cursor-pointer transition-all"
          />
        </form>
      )}
    </div>
  );
}
