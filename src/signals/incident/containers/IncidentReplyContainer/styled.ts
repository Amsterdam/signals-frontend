// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { Heading, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Wrapper = styled.div`
  flex-direction: column;
  width: 100%;
`

export const Content = styled.div`
  margin-bottom: ${themeSpacing(8)};
`

export const StyledHeading = styled(Heading)`
  margin-top: ${themeSpacing(10)};
  margin-bottom: ${themeSpacing(5)};
`

export const StyledSubHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(1)};
  font-size: 1.125rem;
`
