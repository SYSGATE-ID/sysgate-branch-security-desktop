import { IConfigAsset } from '@renderer/interface/configAsset.interface'
import React, { useEffect, useState } from 'react'

export const HomePage: React.FC = () => {
  const [config, setConfig] = useState<IConfigAsset>()
  const [imagePath, setImagePath] = useState<string>('')

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const cfg = await window.api.getMyConfig()
      const imgPath = await window.api.getImage()
      setConfig(cfg)
      setImagePath(imgPath)
    }

    fetchData()
  }, [])

  return (
    <div
      className="h-full w-full bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url("${imagePath.replace(/\\/g, '/')}/background.jpg")`,
      }}
    >
      <div className="h-full overflow-y-auto flex flex-col items-center justify-start p-6 space-y-6">
        <p className="text-white text-xl">{config?.api_secretcode}</p>

        {/* contoh konten panjang */}
        <div className="text-white text-center space-y-4">
          {[...Array(50)].map((_, i) => (
            <p key={i}>Baris konten ke-{i + 1}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
