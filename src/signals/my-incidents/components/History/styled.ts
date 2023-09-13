// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import {
  breakpoint,
  Heading,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${themeSpacing(19.5, 0, 6, 0)};
  width: ${themeSpacing(75)};
  @media ${breakpoint('max-width', 'tabletS')} {
    margin: 0;
    width: 100%;
  }
`

export const StatusBlock = styled.div`
  height: ${themeSpacing(20)};
  background-color: ${themeColor('tint', 'level3')};
`

export const Status = styled.p`
  margin: ${themeSpacing(4, 4, 1, 4)};
`

export const StatusParagraph = styled.p`
  margin: ${themeSpacing(0, 4, 4, 4)};
  font-weight: 700;
`

export const StyledH2 = styled(Heading)`
  margin-bottom: ${themeSpacing(4)};
  margin-top: ${themeSpacing(6)};
`

export const StyledParagraph = styled.div`
  margin-bottom: ${themeSpacing(4)};
  white-space: break-spaces;
`
