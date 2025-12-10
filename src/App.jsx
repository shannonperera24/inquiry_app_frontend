import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'
import { useEffect } from 'react'

import routeTitles from './config/routeTitles'

import ForgotPassword from "./pages/ForgotPassword"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import ResetPassword from "./pages/ResetPassword"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App