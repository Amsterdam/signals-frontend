// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Header = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeColor('tint', 'level5')};
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: ${themeSpacing(4)};
`

export const StyledHeading = styled(Heading)`
  margin: 0;
`
