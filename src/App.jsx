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
import SubmitResponse from './pages/SubmitResponse'

function TitleHandler () {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    // Direct match
    if (routeTitles[path]) {
      document.title = `${routeTitles[path]} | IMS`;
      return;
    }
    // Handle dynamic routes
    if (path.startsWith("/home/view-inquiry/")) {
      const id = path.split("/").pop();
      document.title = `View Inquiry #${id} | IMS`;
    } else if (path.startsWith("/home/submit-response/")) {
      const id = path.split("/").pop();
      document.title = `Submit Response #${id} | IMS`;
    } else if (path.startsWith("/home/edit-category/")) {
      const id = path.split("/").pop();
      document.title = `Edit Category #${id} | IMS`;
    } else if (path.startsWith("/home/edit-user/")) {
      const id = path.split("/").pop();
      document.title = `Edit User #${id} | IMS`;
    } else {
      // Fallback for all other routes
      document.title = "IMS";
    }
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
          <Route path='submit-response/:inquiry_id' element={<SubmitResponse />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App