// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Button from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import Paragraph from 'components/Paragraph'

export const Form = styled.form`
  position: relative;
  padding: ${themeSpacing(5, 5, 6, 5)};
  margin: ${themeSpacing(6)} 0;
  background-color: ${themeColor('tint', 'level2')};

  @media (min-width: ${({ theme }) => theme.layouts.big.max}px) {
    margin-left: ${themeSpacing(23)};
  }
`

export const StyledButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
`

export const StyledH2 = styled(Heading)`
  margin-bottom: ${themeSpacing(4)};
  margin-top: ${themeSpacing(0)};
`

export const StyledSection = styled.section`
  margin-bottom: ${themeSpacing(6)};
`

export const StyledErrorMessage = styled(ErrorMessage)`
  margin-bottom: ${themeSpacing(2)};
`

export const StyledParagraph = styled(Paragraph)`
  margin-bottom: ${themeSpacing(2)};
`

export const ImageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeSpacing(2)};
`

export const Image = styled.img`
  width: 80px;
  object-fit: cover;
`
