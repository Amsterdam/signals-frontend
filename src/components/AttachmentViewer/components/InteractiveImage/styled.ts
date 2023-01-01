// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import styled from 'styled-components'

const ZOOM_FACTOR = 2

type Image = {
  zoom: boolean
}

export const Image = styled.img<Image>`
  cursor: zoom-in;

  && {
    margin: initial;
  }

  ${({ zoom }) =>
    zoom &&
    `
    opacity: 0;
    cursor: zoom-out;
  `}
`

type ZoomedImageProps = {
  zoom: boolean
  backgroundPosition: string
  backgroundImage: string
}

export const ZoomedImage = styled.div.attrs<ZoomedImageProps>(
  ({ backgroundImage, backgroundPosition }) => ({
    // Use style object to prevent recalculation of styled-components class on every mouse move event
    style: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition,
    },
  })
)<ZoomedImageProps>`
  will-change: background-position;
  background-size: ${ZOOM_FACTOR * 100}%;

  // Non-rectangular images have a rectangular zoomed image
  // Hide zoomed image to prevent it from rendering in the background of the main image
  ${({ zoom }) => !zoom && 'background-size: 0;'}
`
