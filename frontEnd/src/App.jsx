import { Routes, Route } from 'react-router-dom'
import NotFound from './pages/NotFound'
import SinhVien from './pages/SinhVien'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SinhVien />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App