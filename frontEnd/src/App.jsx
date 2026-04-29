import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import SinhVien from './pages/SinhVien.jsx'
import NotFound from './pages/NotFound.jsx'
import Navbar from './components/Navbar.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sinhvien" element={<SinhVien />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App