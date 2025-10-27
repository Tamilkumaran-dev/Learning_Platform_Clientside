import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function SelectModule({ moduleId }) {
  const [module, setModule] = useState(null);
  
  const navigate = useNavigate();
  const [editModule, SetEditModule] = useState(true); 

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}check/isLoggedIn`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      } catch (err) {
        alert("Please login to access this page");
        navigate("/auth");
      }
    };
    isLoggedIn();
  }, [navigate]);

  useEffect(() => {
    getModule();
  }, [moduleId, navigate,editModule]);

  const getModule = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}course/module/${moduleId}`,
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );

        let content = res.data.data.content;

        // ✅ Replace ImageUrl patterns (handles quotes, spaces, or <p> wrappers)
        content = content
          // remove any <p> wrappers around ImageUrl
          .replace(
            /<p>\s*ImageUrl\s*[:=]\s*["']?(https?:\/\/[^\s"']+)["']?\s*<\/p>/gi,
            '<img src="$1" alt="Module Image" style="max-width:100%;height:auto;display:block;margin:10px 0;border-radius:8px;" />'
          )
          // replace plain text ImageUrl lines
          .replace(
            /\bImageUrl\s*[:=]\s*["']?(https?:\/\/[^\s"']+)["']?/gi,
            '<img src="$1" alt="Module Image" style="max-width:100%;height:auto;display:block;margin:10px 0;border-radius:8px;" />'
          );

        // ✅ Save the modified content
        setModule({ ...res.data.data, content });
      } catch (err) {
        console.error("Error fetching module:", err);
        alert("Something went wrong while loading the module.");
        navigate("/auth");
      }
    };

const submitModule = async(e)=>{
  e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}admin/updateModule/${moduleId}`,
        { ...module},
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      alert(res.data.message);
      SetEditModule(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding module");
      navigate("/auth");
    }

}


const deleteModule = async(mId)=>{
    try{
       await axios.delete(`${import.meta.env.VITE_BASE_URL}admin/deletedModule/${mId}`,{headers:{"Content-Type":"application/json"},withCredentials:true});
         window.location.reload();
      }
     catch(err){
              console.log("error in deleting");
              console.log(err);
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
          alert("You have to login first");
          navigate("/auth");
        }
        
                    }
}

  return (
    <div>
       <button onClick={()=>{ SetEditModule(!editModule);}}>{editModule ? "Edit Module" : "cancel"}</button>
       <button onClick={()=>{deleteModule(moduleId)}}>Module delete</button>
    {editModule ? (<div style={{ padding: "20px" }}>
      {module ? (
        <>

          <h2>Title: {module.moduleTitle}</h2>
          <h3>About: {module.moduleDes}</h3>
          
          <h3>View content</h3>
          <details open>
            <div
              style={{ marginTop: 10 }}
              dangerouslySetInnerHTML={{ __html: module.content }}
            />
          </details>
        </>
      ) : (
        <p>Loading module...</p>
      )}
    </div>)
    :
    (<div>
      <form onSubmit={(e)=>submitModule(e)}>
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
                  data={module.content || "<p>Write something...</p>"}
                  onChange={(event, editor) =>  setModule({...module,content : editor.getData()})}
                />
              </div>
      
              <input type="submit" value="Save" style={{ cursor: "pointer" }} />
            </form>
    </div>)}

   
    
    
    </div>
  );
}
