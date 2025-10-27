import axios from "axios";
import { useState } from "react"

export default function UserSignUp(props){
    
    const {SignUpOrSignIn} = props;
    const [userData,setUserData] = useState();


    const SignUpMethod = async(e)=>{
        e.preventDefault();
        try{
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/signUp`,userData,{headers:{"Content-Type" : "application/json"},withCredentials : true});
            alert(res.data.message);
            alert("now Login");
            SignUpOrSignIn(false);

        }
        catch(err){
            console.log(err)
            alert(err.response.data.message);
        }
    }
    
    return(<>
            <div>
                <form onSubmit={(e)=>SignUpMethod(e)}>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" onChange={(e)=>{setUserData({...userData,[e.target.name] : e.target.value})}}/>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" onChange={(e)=>{setUserData({...userData,[e.target.name] : e.target.value})}}/>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" onChange={(e)=>{setUserData({...userData,[e.target.name] : e.target.value})}}/>
                    <label htmlFor="conformPassword">Conform password</label>
                    <input type="text" name="conformPassword" id="conformPassword"/>
                    <input type="submit" value="Sign Up"/>
                </form>
            </div>
            </>)
}