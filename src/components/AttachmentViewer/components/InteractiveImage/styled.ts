// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { MAX_ZOOM_LEVEL } from './constants'

type Image = {
  zoom: number
}

export const Image = styled.img<Image>`
  display: block;
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
export const Wrapper = styled.figure`
  display: inline-block;
  margin: unset;
`

export const StyledFigCaption = styled.figcaption`
  background-color: ${themeColor('tint', 'level1')};
  height: 100%;
  font-weight: 700;
  width: 0;
  min-width: calc(100% - 40px);
  overflow-wrap: break-word;
  padding: ${themeSpacing(5)};
  text-align: left;
`
