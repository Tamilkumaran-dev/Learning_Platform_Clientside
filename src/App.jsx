import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Auth from './Page/Auth'
import Nav from './layouts/Nav'
import Home from './Page/UserPages/Home'
import IsLoggin from './Page/isLoggin'
import SelectCourse from './Page/UserPages/SelectCourse'
import AddCourse from './Page/AdminPages/AddCourse'
import AdminProfile from './Page/AdminPages/AdminProfile'
import AdminSelectCourse from './Page/AdminPages/AdminSelectCourse'
import MyCourses from './Page/AdminPages/MyCourses'
import AddModules from './Page/AdminPages/AddModules'
import MyCourse from './Page/UserPages/MyCourse'
import UserProfile from './Page/UserPages/UserProfile'
import AllCourse from './Page/ManagerPages/AllCourse'
import ManagerProfile from './Page/ManagerPages/ManagerProfile'
import Instructor from './Page/ManagerPages/Instructor'
import GetInstructor from './Page/ManagerPages/GetInstructor'
import Footer from './layouts/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Nav/>

        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/auth' element={<Auth/>}/>
          <Route path='/isLoggin' element={<IsLoggin/>}/>
          <Route path='/getCourse/:courseId' element={<SelectCourse/>}/>
          <Route path='/myCourse' element={<MyCourse/>}/>
          <Route path='/profile' element={<UserProfile/>}/>

          {/* admin */}
          <Route path='/admin/addCourse' element={<AddCourse/>}/>
          <Route path='/admin/profile' element={<AdminProfile/>}/>
          <Route path='/admin/myCourse' element={<MyCourses/>}/>
          <Route path='/admin/selectCourse/:courseId' element={<AdminSelectCourse/>}/>
          <Route path='/admin/addModule/:courseId' element={<AddModules/>}/>
          
          {/* Manager */}
          <Route path='/manager/allCourse' element={<AllCourse/>}/>
          <Route path='/manager/getInstructor/:adminId' element={<GetInstructor/>}/>
          <Route path='/manager/profile' element={<ManagerProfile/>}/>
          <Route path='/manager/allUsers' element={<Instructor/>}/>
        



          </Routes>
          <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
