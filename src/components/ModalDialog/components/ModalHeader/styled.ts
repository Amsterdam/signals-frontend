// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Header = styled(Heading)`
  align-items: center;
  border-bottom: 1px solid ${themeColor('tint', 'level5')};
  display: flex;
  justify-content: space-between;
  padding: ${themeSpacing(4)};
`
export const StyledHeading = styled.div`
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 26px;
`
