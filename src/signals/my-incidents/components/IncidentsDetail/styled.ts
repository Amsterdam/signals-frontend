// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { breakpoint, Link, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import BackLink from 'components/BackLink'

export const StyledBacklink = styled(BackLink)`
  margin-top: ${themeSpacing(6)};
`

export const FormTitle = styled.dt`
  color: ${themeColor('tint', 'level5')};
  margin: ${themeSpacing(0, 0, 1)};
`

export const DescriptionWrapper = styled.div`
  margin-bottom: ${themeSpacing(6)};
`

export const StyledDD = styled.dd`
  font-weight: 700;
  font-size: 1.125rem;
`

export const StyledImage = styled.img`
  object-fit: cover;
  width: 100%;
`

export const StyledFigCaption = styled.figcaption``

export const ImagesWrapper = styled.div`
  gap: ${themeSpacing(2)};
  display: grid;

  @media screen and ${breakpoint('min-width', 'tabletS')} {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const ImageWrapper = styled.figure`
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  position: relative;
  display: inline-block;

  > img {
    aspect-ratio: 4/3;
  }

  @media screen and ${breakpoint('min-width', 'tabletS')} {
    min-width: 180px;
  }
`
export const StyledLink = styled(Link)`
  cursor: pointer;
  text-decoration: underline;
`

export const ContentWrapper = styled.div`
  overflow-wrap: anywhere;
  max-width: ${themeSpacing(160)};
`

export const Wrapper = styled.div``
