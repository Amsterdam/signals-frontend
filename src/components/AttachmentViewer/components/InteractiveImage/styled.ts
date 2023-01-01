// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import styled from 'styled-components'

import { MAX_ZOOM_LEVEL } from './constants'

type Image = {
  zoom: number
}

export const Image = styled.img<Image>`
  && {
    margin: initial;
  }

  ${({ zoom }) =>
    zoom === MAX_ZOOM_LEVEL ? 'cursor: zoom-out;' : 'cursor: zoom-in;'}
  ${({ zoom }) => zoom && 'opacity: 0;'}
`

type ZoomedImageProps = {
  zoom: number
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
  ${({ zoom }) => `background-size: ${zoom * 200}%`}
`
