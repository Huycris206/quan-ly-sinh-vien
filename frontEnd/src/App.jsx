import { Routes, Route } from 'react-router-dom'
import NotFound from './pages/NotFound'
import SinhVien from './pages/SinhVien'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SinhVien />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App