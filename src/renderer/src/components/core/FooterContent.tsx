import React, { useEffect, useState } from 'react'
import { FormatWaktuSekarang } from '@utils/myFunctions'

export const FooterContent: React.FC = () => {
  const [waktu, setWaktu] = useState(FormatWaktuSekarang())

  useEffect(() => {
    const timer = setInterval(() => setWaktu(FormatWaktuSekarang()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full bg-gradient-to-r from-sky-700 via-blue-600 to-pink-600 text-white py-3 px-6 flex items-center justify-between">
      <div className="font-bold text-lg tracking-wide">PLEASE LOGIN FIRST</div>
      <div className="font-bold text-lg tracking-wide">{waktu}</div>
    </div>
  )
}
