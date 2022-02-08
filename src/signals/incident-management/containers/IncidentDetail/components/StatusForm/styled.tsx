// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import {
  Alert,
  Heading,
  Label,
  Row,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import type { AlertLevel } from '@amsterdam/asc-ui'

import Button from 'components/Button'

export const AddNoteWrapper = styled.div`
  label.addNoteText {
    display: none;
  }
  section div textarea {
    padding: ${themeSpacing(3)};
    margin-top: 0;
    border-top: 1px solid transparent;
    :hover {
      border-top-color: transparent;
    }
  }
`

export const Form = styled.form`
  position: relative;
  padding: ${themeSpacing(5, 5, 6, 5)};
  margin-bottom: ${themeSpacing(6)};
  background-color: ${themeColor('tint', 'level2')};
  width: 100%;
`

export const StandardTextsButton = styled(Button)`
  margin-top: ${themeSpacing(2)};
  border-bottom: none;
  border-color: ${themeColor('tint', 'level5')};
  padding: ${themeSpacing(3, 3, 0, 3)};
  width: 100%;
  :hover {
    outline-style: none;
  }
  div {
    font-weight: normal;
    font-family: 'Avenir Next';
    text-align: left;
    width: 100%;
    height: 100%;
    padding-bottom: ${themeSpacing(3)};
    border-bottom: 1px solid ${themeColor('tint', 'level4')};
  }
`

export const StyledAlert = styled(Alert)<{ level?: AlertLevel }>`
  ${({ level }) =>
    level === 'neutral' ? 'background-color: transparent; padding: 0;' : ''}
`

export const StyledButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
`

export const StyledH4 = styled(Heading)`
  margin-bottom: ${themeSpacing(2)};
  margin-top: ${themeSpacing(0)};
`

export const StyledLabel = styled(Label)`
  font-weight: 700;
`

export const StyledParagraph = styled.p`
  color: inherit;
  margin: 0;
`

export const StyledSection = styled.section`
  margin-bottom: ${themeSpacing(6)};
`

export const TextsArea = styled.div`
  grid-area: texts;
  margin-top: ${themeSpacing(5)};
`

export const Wrapper = styled(Row)`
  background-color: ${themeColor('tint', 'level1')};
  position: relative;
`
