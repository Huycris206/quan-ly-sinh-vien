function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl mt-4">Trang không tồn tại!</p>
      <a href="/" className="mt-6 text-blue-500 underline">
        Về trang chủ
      </a>
    </div>
  )
}

export default NotFound