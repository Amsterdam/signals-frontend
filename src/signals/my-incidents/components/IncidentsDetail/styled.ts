// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Link, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import BackLink from 'components/BackLink'
import styled from 'styled-components'

export const StyledBacklink = styled(BackLink)`
  margin-top: ${themeSpacing(8)};
`

export const FormTitle = styled.p`
  color: ${themeColor('tint', 'level5')};
  margin-top: 0;
  margin-bottom: 0;
`

export const StyledImg = styled.img`
  max-width: 100%;
  height: 135px;
`

export const StyledLink = styled(Link)`
  margin-bottom: ${themeSpacing(6)};
  cursor: pointer;
`
