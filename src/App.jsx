import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'
import { useEffect } from 'react'

import routeTitles from './config/routeTitles'

import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import SubmitInquiry from './pages/SubmitInquiry'
import Home from './pages/Home'
import Inquiries from './pages/Inquiries'
import Requesters from './pages/Requesters'
import Categories from './pages/Categories'
import Users from './pages/Users'
import Profile from './pages/Profile'
import ViewInquiry from './pages/ViewInquiry'
import AddCategory from './pages/AddCategory'
import EditCategory from './pages/EditCategory'
import AddUser from './pages/AddUser'
import EditUser from './pages/EditUser'
import ChangePassword from './pages/ChangePassword'

function TitleHandler () {
  const location = useLocation();
  useEffect(() => {
    let path = location.pathname;
    const title = routeTitles[path]
      ?`${routeTitles[path]} | IMS`: 'IMS';
    document.title = title;
  }, [location.pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <TitleHandler />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/submit-inquiry" element={<SubmitInquiry />} />
        <Route path="/home" element={<Home />}>
          <Route index element={<Dashboard />} />
          <Route path='inquiries' element={<Inquiries />} />
          <Route path='view-inquiry/:inquiry_id' element={<ViewInquiry />} />
          <Route path='requesters' element={<Requesters />} />
          <Route path='categories' element={<Categories />} />
          <Route path='add-category' element={<AddCategory />} />
          <Route path='edit-category/:category_id' element={<EditCategory />} />
          <Route path='users' element={<Users />} />
          <Route path='add-user' element={<AddUser />} />
          <Route path='edit-user/:user_id' element={<EditUser />} />
          <Route path='profile' element={<Profile />} />
          <Route path='change-password' element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App