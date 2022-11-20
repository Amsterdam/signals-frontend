// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import styled from 'styled-components'
import {breakpoint, Heading, themeColor, themeSpacing} from '@amsterdam/asc-ui'

export const Wrapper = styled.div`
display: flex;
  flex-direction: column;
  margin: ${themeSpacing(8, 0, 6, 25)};
  width: ${themeSpacing(75)};

  @media ${breakpoint('max-width', 'tabletS')} {
    margin: ${themeSpacing(8, 0, 6)};
  }
`

export const StatusBlock = styled.div`
  height: ${themeSpacing(20)};
  background-color: ${themeColor('tint', 'level3')};
`
export const Status = styled.p`
  margin: ${themeSpacing(4, 4, 1, 4)};
`

export const StatusStat = styled.p`
  margin: ${themeSpacing(0, 4, 4, 4)};
  font-weight: 700;
`

export const StyledH4 = styled(Heading)`
  margin-bottom: ${themeSpacing(4)};
  margin-top: ${themeSpacing(3)};
`
