// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { ElementType } from 'react'

import {
  Button,
  Column,
  Heading,
  Icon,
  Label,
  Select,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

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

export const StyledHeading = styled.label`
  margin-bottom: ${themeSpacing(1)};
  font-weight: bold;
  line-height: 1.375rem;
  font-size: 1rem;
`

export const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${themeSpacing(2)};
`

export const StyledIcon = styled(Icon)`
  margin-bottom: ${themeSpacing(2)};
`

export const DeleteButton = styled(Button)`
  margin-left: ${themeSpacing(2)};
  justify-content: center;
  height: 44px;
  width: 44px;
`
export const StyledInfo = styled.p`
  margin-top: ${themeSpacing(0)};
  margin-bottom: ${themeSpacing(1)};
`

export const InvisibleButton = styled.button<{ toggle: boolean }>`
  text-decoration: none;
  background-color: unset;
  color: inherit;
  border: none;
  padding: 0;

  > * {
    transition: transform 0.25s;
    ${({ toggle }) =>
      toggle &&
      css`
        transform: rotate(180deg);
      `}
  }
`
export const StyledImg = styled.img`
  max-height: ${themeSpacing(8)};
  align-self: flex-start;
  margin-top: ${themeSpacing(2.5)};
`

export const Wrapper = styled.div`
  display: flex;

  & > *:not(:first-child) {
    margin-left: ${themeSpacing(2)};
  }
`
