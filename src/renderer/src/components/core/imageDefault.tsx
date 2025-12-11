import React, { useState } from 'react'
import { useConfigStore } from '@renderer/store/configProvider'

interface ImageDefaultProps {
  url?: string | null
  alt?: string
  className?: string
  style?: React.CSSProperties
  rounded?: string // contoh: "rounded-lg"
  width?: string // contoh: "w-full"
  height?: string // contoh: "h-40"
  objectFit?: string // contoh: "object-cover"
}
export const ImageDefault: React.FC<ImageDefaultProps> = ({
  url,
  alt = 'Image',
  className = '',
  style,
  rounded = 'rounded-lg',
  width = 'w-full',
  height = '',
  objectFit = 'object-cover'
}) => {
  const { assetsPathConfig } = useConfigStore()
  const [imgSrc, setImgSrc] = useState(url || `${assetsPathConfig}\\images\\no_img.jpg`)

  return (
    <img
      style={style}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(`${assetsPathConfig}\\images\\no_img.jpg`)}
      className={`${rounded} ${width} ${height} ${objectFit} ${className}`}
    />
  )
}
