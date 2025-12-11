import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'
import { useEffect } from 'react'

import routeTitles from './config/routeTitles'

import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import SubmitInquiry from './pages/SubmitInquiry'

const TitleHandler = () => {
  const location = useLocation();
  useEffect(() => {
    const title = routeTitles[location.pathname] || 'Inquiry Management System';
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
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App