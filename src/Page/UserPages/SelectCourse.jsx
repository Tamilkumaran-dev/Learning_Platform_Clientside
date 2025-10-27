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
  const [isCompleted,setIsCompleted] = useState(false);
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
             console.log("Get list",res.data.data)
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].course.id == courseId) {
              foundCourse = res.data.data[i].course;
              setCourse(foundCourse);
              setCourseStatus(res.data.data[i].courseStatus);
              setEnrolled(true);
              setSelectModule(res.data.data[i].course.modules.length > 0 ? res.data.data[i].course.modules[0].id : null);
              setIsCompleted(res.data.data[i].courseStatus != null ? res.data.data[i].courseStatus.modules.includes(res.data.data[i].course.modules[0].id) : false);
              break;
            }
          }

          // if not enrolled in this course
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
        }
        else{
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
        console.log("this is the err");
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
    };


  useEffect(() => {
    fetchCourse(); // ✅ call the async function
  }, [courseId, navigate]);

  const enrollmethod = async(e)=>{
    e.preventDefault();
    try{
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}user/enrollCourse/${courseId}`,{},{
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          })
          alert(res.data.message);
          fetchCourse();
    }
    catch(err){
            console.log(err);
            alert("something went wrong");
    }
  }

  return (
    <>
      <div>
        <button onClick={()=>{navigate(-1)}} >Go Back</button>
        {enrolled ? (
          <div>
            <h1>{course?.courseTitle}</h1>
            <h2>{course?.courseDes}</h2>
            <div>
              {(course?.modules.length > 0 )?
              (<ul>
                <h3>Modules</h3>
                {course?.modules?.map((m) => (
                  <li onClick={() => {
                    setSelectModule(m.id);
                    if(courseStatus != null){
                         setIsCompleted(courseStatus.modules.includes(m.id));
                    }
                    else{
                        setIsCompleted(false);
                    }
                    } } key={m.id}>
                    {m.moduleTitle}
                  </li>
                ))}
              </ul>)
              :(<ul>
                no modules are in this course
              </ul>)
              }
              <div>
                {SelectModule && <SelectContent moduleId={SelectModule} isCompleted={isCompleted} isCompletedMethod={setIsCompleted} courseId={courseId}/>}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {course && (
              <div>
                <h1>{course.courseTitle}</h1>
                <h2>{course.courseDes}</h2>
                <h3>Enroll to access content</h3>
                <button onClick={(e)=>enrollmethod(e)}>Enroll</button>

                {(course.modules.length > 0) ? (<ul>
                  <h3>Modules</h3>
                  {course.modules.map((m) => (
                    <li
                      key={m.id}
                      onClick={() =>
                        alert("You have to enroll first to view all the content")
                      }
                    >
                      <h2>{m.moduleTitle}</h2>
                      <details>
                        description : {m.moduleDes}
                      </details>
                    </li>
                  ))}
                </ul>)
                :(
                    <ul>
                        no module on this course
                    </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
