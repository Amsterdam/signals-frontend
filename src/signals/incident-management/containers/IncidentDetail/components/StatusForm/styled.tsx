// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import {
  Heading,
  themeSpacing,
  Row,
  Column,
  themeColor,
  Label,
} from '@amsterdam/asc-ui'

import Button from 'components/Button'

export const AddNoteWrapper = styled.div`
  label {
    display: none;
  }
  section div textarea {
    margin-top: 0;
    border-top: 1px solid transparent;
    :hover {
      border-top-color: transparent;
    }
  }
`

export const Form = styled.form`
  position: relative;
  width: 100%;
  grid-template-areas:
    'header'
    'options'
    'texts'
    'form';
  grid-column-gap: 20px;
  display: grid;
  margin-bottom: 5em;
  grid-row-gap: ${themeSpacing(4)};

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    grid-template-columns: 6fr 6fr;
    grid-template-areas:
      'header texts'
      'options texts'
      'form texts'
      '. texts';
  }
`

export const HeaderArea = styled.div`
  grid-area: header;
`

export const StyledLabel = styled(Label)`
  font-weight: 700;
`

export const OptionsArea = styled.div`
  grid-area: options;
  display: grid;
  grid-row-gap: ${themeSpacing(4)};
`

export const TextsArea = styled.div`
  grid-area: texts;
  margin-top: ${themeSpacing(5)};
`

export const FormArea = styled.div`
  grid-area: form;
  display: grid;
  grid-row-gap: ${themeSpacing(6)};
`

export const QuestionLabel = styled.div`
  margin: ${themeSpacing(2)} 0;
`

export const StandardTextsButton = styled(Button)`
  margin-top: ${themeSpacing(2)};
  border-bottom: none;
  border-color: ${themeColor('tint', 'level5')};
  padding: ${themeSpacing(3, 2, 0, 2)};
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

export const StyledH4 = styled(Heading)`
  margin-bottom: ${themeSpacing(2)};
  margin-top: ${themeSpacing(5)};
`

export const StyledParagraph = styled.p`
  color: ${themeColor('tint', 'level5')};
  margin: 0;
`

export const Wrapper = styled(Row)`
  background-color: ${themeColor('tint', 'level1')};
  position: relative;
`

export const StyledColumn = styled(Column)`
  display: block;
  background-color: ${themeColor('tint', 'level1')};
  position: relative;
  margin-bottom: ${themeSpacing(3)};
`

export const StyledButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
`
