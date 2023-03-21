// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Link, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import BackLink from 'components/BackLink'

export const StyledBacklink = styled(BackLink)`
  margin-top: ${themeSpacing(6)};
`

export const FormTitle = styled.p`
  color: ${themeColor('tint', 'level5')};
  margin: ${themeSpacing(0, 0, 1)};
`

export const StyledImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`

export const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
  width: 180px;
  height: 135px;
`

export const StyledLink = styled(Link)`
  cursor: pointer;
  text-decoration: underline;
`

export const Wrapper = styled.div`
  margin-bottom: ${themeSpacing(6)};
`
