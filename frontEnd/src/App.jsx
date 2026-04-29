import { Routes, Route,BrowserRouter } from 'react-router-dom'
import NotFound from './pages/NotFound'
import SinhVien from './pages/SinhVien'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SinhVien />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App