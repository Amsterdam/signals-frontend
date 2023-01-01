// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { useEffect, useState } from 'react'

import { ZoomedImage, Image } from './styled'

type InteractiveImageProps = {
  src: string
  alt: string
  className?: string
}

/**
 * Renders an image with zoom functionality.
 *
 * When zoomed in, the position of the image follows mouse movement.
 */
const InteractiveImage = ({
  src,
  alt,
  className,
  ...rest
}: InteractiveImageProps) => {
  const [showZoomedImage, setShowZoomedImage] = useState(false)
  const [backgroundPosition, setBackgroundPosition] = useState('100% 100%')

  useEffect(() => {
    setShowZoomedImage(false)
  }, [src])

  const toggleZoom = () => {
    setShowZoomedImage(!showZoomedImage)
  }

  /* istanbul ignore next: nativeEvent not implemented in testing library */
  const handleMouseMove: React.MouseEventHandler<HTMLImageElement> = (
    event
  ) => {
    const x =
      (event.nativeEvent.offsetX / event.currentTarget.offsetWidth) * 100
    const y =
      (event.nativeEvent.offsetY / event.currentTarget.offsetHeight) * 100

    setBackgroundPosition(`${x}% ${y}%`)
  }

  return (
    <ZoomedImage
      className={className}
      zoom={showZoomedImage}
      onClick={toggleZoom}
      onMouseMove={handleMouseMove}
      backgroundPosition={backgroundPosition}
      backgroundImage={src}
      data-testid="zoomed-interactive-image"
    >
      <Image
        className={className}
        zoom={showZoomedImage}
        loading="lazy"
        src={src}
        alt={alt}
        data-testid="interactive-image"
        {...rest}
      />
    </ZoomedImage>
  )
}

export default InteractiveImage
