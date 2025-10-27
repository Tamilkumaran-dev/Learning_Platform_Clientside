import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}check/isLoggedIn`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (res.data.data === "ROLE_USER" ) {
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
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
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
    <div style={{ padding: "20px" }}>
      <button onClick={()=>navigate(-1)}>Go Back</button>
      <h1>{addAnotherModule ? "Add another module" : "Add module"}</h1>

      <form onSubmit={submitModule}>
        <label htmlFor="moduleTitle">Module Title</label>
        <input
          type="text"
          name="moduleTitle"
          id="moduleTitle"
          value={module.moduleTitle}
          onChange={(e) => setModule({ ...module, [e.target.name]: e.target.value })}
          required
          style={{ display: "block", marginBottom: "10px", width: "80%" }}
        />

        <label htmlFor="moduleDes">Module Description</label>
        <textarea
          name="moduleDes"
          id="moduleDes"
          cols="30"
          rows="5"
          value={module.moduleDes}
          onChange={(e) => setModule({ ...module, [e.target.name]: e.target.value })}
          required
          style={{ display: "block", marginBottom: "15px", width: "80%" }}
        ></textarea>

        <div style={{ marginBottom: "20px", width: "80%", color: "black" }}>
          <CKEditor
            editor={ClassicEditor}
            data={content || "<p>Write something...</p>"}
            onChange={(event, editor) => setContent(editor.getData())}
          />
        </div>

        <input type="submit" value="Add Module" style={{ cursor: "pointer" }} />
      </form>
    </div>
  );
}