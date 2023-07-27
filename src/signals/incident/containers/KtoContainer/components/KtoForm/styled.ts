// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Label from 'components/Label'
import TextArea from 'components/TextArea'

export const Form = styled.form`
  display: grid;
  grid-row-gap: 32px;
  margin-top: ${themeSpacing(8)};
`

export const GridArea = styled.div``

export const FieldSet = styled.fieldset`
  border: 0;
  padding: 0;
`

export const StyledLabel = styled(Label)`
  margin-bottom: 0;
`

export const CheckboxWrapper = styled(Label)`
  display: block;
`

export const Optional = styled.span`
  font-weight: 400;
`

export const HelpText = styled.p`
  color: ${themeColor('tint', 'level5')};
  margin-top: 0;
  margin-bottom: 0;
  line-height: ${themeSpacing(6)};
`

export const StyledTextArea = styled(TextArea)`
  margin-top: ${themeSpacing(3)};
`
