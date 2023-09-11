// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Vereniging van Nederlandse Gemeenten
import { useEffect, useState } from 'react'

import { MAX_ZOOM_LEVEL } from './constants'
import { ZoomedImage, Image, StyledFigCaption, Wrapper } from './styled'

type InteractiveImageProps = {
  src: string
  alt: string
  caption?: string
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
  caption,
  ...rest
}: InteractiveImageProps) => {
  const [zoomFactor, setZoomFactor] = useState(0)
  const [backgroundPosition, setBackgroundPosition] = useState('100% 100%')

  useEffect(() => {
    setZoomFactor(0)
  }, [src])

  const setNextZoomFactor = () => {
    setZoomFactor(zoomFactor === MAX_ZOOM_LEVEL ? 0 : zoomFactor + 1)
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
      zoom={zoomFactor}
      onClick={setNextZoomFactor}
      onMouseMove={handleMouseMove}
      backgroundPosition={backgroundPosition}
      backgroundImage={src}
      data-testid="zoomed-interactive-image"
    >
      <Wrapper>
        <Image
          className={className}
          zoom={zoomFactor}
          loading="lazy"
          src={src}
          alt={alt}
          data-testid="interactive-image"
          {...rest}
        />
        {caption && <StyledFigCaption>{caption}</StyledFigCaption>}
      </Wrapper>
    </ZoomedImage>
  )
}

export default InteractiveImage
