// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam

import { Button, breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledMainContainer = styled.div`
  display: grid;
  grid-column: span 1;
  row-gap: ${themeSpacing(8)};
  padding-bottom: ${themeSpacing(8)};
`

export const StyledForm = styled.form`
  display: grid;
  padding-top: ${themeSpacing(8)};
  width: 100%;

  @media ${breakpoint('min-width', 'tabletM')} {
    column-gap: ${({ theme }) => theme.layouts.large.gutter}px;
    grid-template-columns: 7fr 5fr;
  }
`

export const StyledDefinitionList = styled.dl`
  margin: 0;
  display: grid;
  grid-row-gap: 0;
  padding-bottom: ${themeSpacing(4)};

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-template-columns: 3fr 3fr;
  }

  @media ${breakpoint('min-width', 'laptop')} {
    grid-template-columns: 3fr 2fr;
  }

  dt,
  dd {
    @media ${breakpoint('min-width', 'tabletM')} {
      padding: ${themeSpacing(2)} 0;
    }
  }

  dt {
    color: ${themeColor('tint', 'level5')};
    margin: 0;
    font-weight: 400;
  }

  dd {
    padding-bottom: ${themeSpacing(2)};
    font-weight: 600;
    width: 100%;
  }
`

export const ThinLabel = styled.span`
  font-weight: 400;
`

export const StyledButtonContainer = styled.div`
  grid-column: span 1;
`

export const StyledSubmitButton = styled(Button)`
  margin-right: ${themeSpacing(5)};
`
