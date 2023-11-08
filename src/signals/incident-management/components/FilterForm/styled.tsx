// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { themeSpacing, themeColor } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import FormFooter from 'components/FormFooter'

export const Form = styled.form`
  column-count: 2;
  column-gap: 100px;
  width: 100%;
  padding-bottom: 86px;

  @media (max-width: 1020px) {
    column-gap: 60px;
  }
  @media (max-width: 600px) {
    column-count: 1;
  }

  label {
    color: ${themeColor('tint', 'level7')};
  }
`

export const ControlsWrapper = styled.div`
  break-inside: avoid;
  margin-bottom: 50px;
  padding-bottom: 1px; // Prevents flickering on Safari when hovering checkbox element in filter modal.
`

export const FilterGroup = styled.div`
  & + & {
    margin-top: 30px;
  }
`

export const Fieldset = styled.fieldset<{ isSection?: boolean }>`
  border: 0;
  padding: 0;

  &:not(:first-of-type),
  &:first-of-type:last-of-type {
    margin: ${themeSpacing(7, 0)};
  }

  legend {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .invoer {
    margin-bottom: ${themeSpacing(8)};

    &.Label {
      margin-top: ${themeSpacing(5)};
    }
  }

  svg {
    vertical-align: top;
  }

  ${({ isSection }) =>
    isSection &&
    css`
      background-color: ${themeColor('tint', 'level2')};
      padding: 15px 21px;
    `}
`

export const DatesWrapper = styled.div`
  display: flex;
  & > :first-child {
    margin-right: ${themeSpacing(5)};
  }
`

export const FormFooterWrapper = styled(FormFooter)`
  button[type='reset'] {
    order: 1;
  }
  button[type='submit'] {
    margin-left: ${themeSpacing(4)};
    order: 3;
  }
  button[type='button'] {
    order: 2;
  }
`
export const StyledNotification = styled.div`
  margin-bottom: ${themeSpacing(5)};
  scroll-margin-top: ${themeSpacing(5)};
`
