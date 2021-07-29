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
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
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

export const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(2)};
  margin-top: ${themeSpacing(5)};
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
