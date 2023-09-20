// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { ElementType } from 'react'

import { themeSpacing, Column, Select, Heading, Label } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import FormFooter from 'components/FormFooter'
import History from 'components/History'

export const Form = styled.form`
  width: 100%;
`

export const FormContainer = styled.div`
  // taking into account the space that the FormFooter component takes up
  padding-bottom: 66px;
`

export const StyledColumn = styled(Column)`
  contain: content;
  flex-direction: column;
  justify-content: flex-start;
`

export const FieldGroup = styled.div`
  & + & {
    margin-top: ${themeSpacing(8)};
  }
`

export const StyledFormFooter = styled(FormFooter)`
  position: fixed;
`

export const CombinedFields = styled.div`
  display: flex;
  margin-top: ${themeSpacing(1)};

  input {
    flex: 1 0 auto;
    max-width: 75px;
  }

  select {
    flex: 2 1 auto;
  }
`

export const StyledSelect = styled(Select)`
  height: 44px;
`

export const StyledLabel = styled(Label)`
  font-weight: 400;
`

export const StyledH2 = styled(Heading)`
  margin-bottom: ${themeSpacing(2)};
  font-weight: bold;
  line-height: 1.375rem;
  font-size: 1rem;
`

export const StyledHistory = styled(History as ElementType)`
  h2 {
    font-size: 1rem;
  }
`

export const StyledDefinitionTerm = styled.dt`
  margin-bottom: ${themeSpacing(1)};
`

export const StyledHeading = styled.p`
  margin-bottom: ${themeSpacing(1)};
  font-weight: bold;
  line-height: 1.375rem;
  font-size: 1rem;
`
