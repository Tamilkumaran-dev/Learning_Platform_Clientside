import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectContent(props){

    const {moduleId, isCompleted, isCompletedMethod, courseId} = props;
    const[module,setModule] = useState();
    const navigate = useNavigate();

    useEffect(()=>{
        const getModule = async()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}course/module/${moduleId}`,{headers : {"Content-Type" : "application/json"},withCredentials:true})
                setModule(res.data.data);
            }
            catch(err){
                            console.log(err);
                            if(err.response.status == 403){
                            alert("Login first to access course");
                                navigate("/auth");
                            }
                            else if(err.response.status == 401){
                                alert("your session expired login again to continue");
                                navigate("/auth")
                            }
                            else if(err.response.status == 404){
                                alert("you can't access this page");
                                navigate("/auth")
                            }
                            else{
                                alert("Somthing went wrong",err.response.status);
                                navigate("/auth")
                            }
            
        }

        }
        getModule();
    },[moduleId])

    const MarkComplete = async()=>{
        try{
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}user/completeModule/${courseId}/${moduleId}`,{},{headers : {"Content-Type" : "application/json"},withCredentials:true})
            console.log(res)
            isCompletedMethod(true);
        }
        catch(err){
            console.log("error in the completing the module")
            console.log(err);
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

    }

    return(
        <>
            <div>
                {module ? 
                (<div>
                    <h2>{module.moduleTitle}</h2>
                    <h3>{module.moduleDes}</h3>
                    <div>
                        <div
                        style={{ marginTop: 10 }}
                        dangerouslySetInnerHTML={{ __html: module.content }}
                        />
                    </div>
                    <button onClick={()=>{MarkComplete()}} disabled={isCompleted}>{isCompleted ? "Completed" : "Mark it has completed"}</button>
                </div>)
                 :
                (<div></div>)}
            </div>
        </>
    )


}