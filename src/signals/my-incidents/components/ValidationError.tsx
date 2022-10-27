// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { themeSpacing, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const ErrorItem = styled.p`
  border: ${themeColor('support', 'invalid')} 2px solid;
  color: ${themeColor('support', 'invalid')};
  font-weight: 700;
  line-height: ${themeSpacing(6)};
  margin-bottom: 0;
  margin-top: 0;
  padding: ${themeSpacing(3)};
`

interface Props {
  label: string
}

export const ValidationError = ({ label }: Props) => {
  return <ErrorItem role="alert">{label}</ErrorItem>
}
