import React from 'react'

const Loadingcomp = ({caigi}) => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Đang tải {caigi}...</span>
    </div>
  )
}

export default Loadingcomp
