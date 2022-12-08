// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { breakpoint, themeColor, themeSpacing, Link } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Divider = styled.div`
  width: 100%;
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
`

export const Wrapper = styled.div`
  margin: ${themeSpacing(4, 0)};
`

export const Heading = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and ${breakpoint('max-width', 'tabletS')} {
    flex-direction: column;

    span:nth-child(2) {
      margin: ${themeSpacing(1, 0)};
    }
  }
`

export const IncidentID = styled.span`
  font-weight: 700;
`

export const Status = styled.div<{ status: string }>`
  color: ${({ status }) =>
    status === 'open'
      ? themeColor('support', 'invalid')
      : themeColor('support', 'valid')};
  font-weight: 700;
  margin-bottom: ${themeSpacing(4)};
`

export const StyledParagraph = styled.div`
  font-size: 1rem;
  margin-bottom: ${themeSpacing(4)};
`

export const StyledLink = styled(Link)`
  a {
    font-size: 1rem;
    line-height: ${themeSpacing(6)};
  }
`
