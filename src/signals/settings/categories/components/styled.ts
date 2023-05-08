// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { ElementType } from 'react'

import {
  Alert,
  themeSpacing,
  Column,
  Select,
  Label,
  themeColor,
  Button,
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
  line-height: 22px;
  font-size: 1rem;
`
export const IconUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
export const StyledAlert = styled(Alert)`
  background-color: ${themeColor('primary')};
  color: ${themeColor('tint', 'level1')};
  margin-top: ${themeSpacing(5)};
  padding: ${themeSpacing(1, 1, 4, 1)};
`

export const StyledParagraphStrong = styled.p`
  font-weight: 700;
  font-size: 1.125rem;
  margin: ${themeSpacing(4, 4, 0)};
`
export const StyledParagraph = styled.p`
  margin: ${themeSpacing(0, 4, 4, 4)};
`
export const StyledButton = styled(Button)<{
  $hasError: boolean
}>`
  background-color: ${themeColor('tint', 'level1')};
  height: ${themeSpacing(8)};
  color: ${themeColor('tint', 'level7')};
  margin-right: ${themeSpacing(3.25)};
  font-weight: 700;
  padding: ${themeSpacing(1, 4)};
  ${({ $hasError }) =>
    $hasError
      ? css`
          border-color: ${themeColor('secondary')};
        `
      : css`
          border-color: ${themeColor('tint', 'level6')};
        `}
`

export const DeleteButton = styled(Button).attrs(() => ({
  size: 13,
  iconSize: 16,
}))`
  width: ${themeSpacing(8)};
  height: ${themeSpacing(8)};
  border-style: solid;
  border-width: 1px;
  border-color: ${themeColor('tint', 'level6')};
`

export const WrapperInputIcon = styled.div`
  input[type='file'] {
    display: none;
    opacity: 0;
    width: 0;
    height: 0;
  }

  & > label {
    cursor: pointer;
  }
`

export const WrapperSetIcon = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${themeSpacing(5)};
`

export const StyledImg = styled.img`
  max-height: ${themeSpacing(8)};
  align-self: flex-start;
  margin-top: ${themeSpacing(2.5)};
`

export const WrapperInfo = styled.div`
  display: flex;
  font-weight: 400;
`
export const StyledInfo = styled.p`
  color: ${themeColor('primary')};
  margin: ${themeSpacing(1.5, 1.25, 0, 0)};
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

export const StyledInstructions = styled.p`
  color: ${themeColor('tint', 'level6')};
  margin: ${themeSpacing(0)};
`
