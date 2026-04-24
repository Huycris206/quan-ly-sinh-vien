import { Routes, Route } from 'react-router-dom'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1 className="p-4 text-2xl font-bold">Trang Chủ</h1>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App