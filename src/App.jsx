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
          <Route path='users' element={<Users />} />
          <Route path='profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App