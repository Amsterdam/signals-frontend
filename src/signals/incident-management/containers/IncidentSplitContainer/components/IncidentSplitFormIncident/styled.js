// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam

import {
  Button,
  breakpoint,
  Heading,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledFieldset = styled.fieldset`
  background-color: ${themeColor('tint', 'level3')};
  scroll-margin-top: ${themeSpacing(15)};
  padding: ${themeSpacing(5)};
  margin-inline: -${themeSpacing(5)};
  display: grid;
  row-gap: ${themeSpacing(8)};
  margin-bottom: ${themeSpacing(8)};

  @media ${breakpoint('min-width', 'tabletM')} {
    column-gap: ${({ theme }) => theme.layouts.large.gutter}px;
    grid-column: span 2;
    grid-template-columns: 7fr 5fr;
  }
`

export const StyledHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-column: span 2;
  }
`

export const StyledHeading = styled(Heading)`
  margin-bottom: 0;
`

export const StyledWrapper = styled.div`
  padding-top: ${themeSpacing(6)};
  padding-bottom: ${themeSpacing(6)};
`

export const StyledGrid = styled.div`
  display: grid;
  grid-row-gap: ${themeSpacing(8)};

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-column: span 1;
  }
`

export const StyledExtraIncidentButtonContainer = styled.div`
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
  padding-bottom: ${themeSpacing(8)};
  margin-bottom: ${themeSpacing(2)};

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-column: span 2;
  }
`

export const RemoveButton = styled(Button)`
  justify-content: center;
  height: 44px;
  width: 44px;
`
