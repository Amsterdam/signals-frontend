// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Divider = styled.div`
  width: 100%;
  border-bottom: 2px solid rgb(230, 230, 230);
`

export const Wrapper = styled.div`
  margin: ${themeSpacing(4, 0)};
`

export const Heading = styled.div`
  display: flex;
  justify-content: space-between;
`

export const IncidentID = styled.span`
  font-weight: 700;
`

export const Status = styled.div<{ status: string }>`
  color: ${({ status }) =>
    status === 'open' ? 'rgb(255,0,0)' : 'rgb(0,128,0)'};
  font-weight: 700;
  margin-bottom: ${themeSpacing(4)};
`

export const StyledParagraph = styled.div`
  font-size: ${themeSpacing(4)};
  margin-bottom: ${themeSpacing(4)};
`
