// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { ChevronDown } from '@amsterdam/asc-assets'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { INPUT_SIZE } from '@amsterdam/asc-ui/lib/components/shared/constants'
import styled, { css } from 'styled-components'

export const OptionUl = styled.ul`
  width: 100%;
  position: absolute;
  z-index: 1;
  max-height: 35rem;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  border: 1px solid ${themeColor('tint', 'level5')};
`

export const OptionLi = styled.li`
  line-height: ${themeSpacing(5)};
  padding: ${themeSpacing(2, 5, 2, 10)};
  cursor: pointer;
  display: flex;
  list-style: unset;
  margin: 0;
  background: ${themeColor('tint', 'level1')};
  &:hover,
  &:focus {
    background-color: ${themeColor('tint', 'level3')};
  }
`

export const OptionLiGroup = styled(OptionLi)`
  color: ${themeColor('tint', 'level5')};
  padding: ${themeSpacing(2, 5)};

  &:hover,
  &:focus {
    background-color: ${themeColor('tint', 'level1')};
  }
`

export const SelectSearchWrapper = styled.div`
  position: relative;
`

export const StyledInputWrapper = styled.div`
  position: relative;
  height: ${INPUT_SIZE}px;
  width: 100%;
`
export const AbsoluteContentWrapper = styled.div.attrs({
  'aria-hidden': 'true',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  margin: 3px; /* Allows the default browser(s) default focus style to be displayed. */
  padding: 0 calc(${themeSpacing(3)} - 1px); /* Match the spacing of the select element. */
  display: flex;
  align-items: center;
  pointer-events: none;
  background-color: ${themeColor('tint', 'level1')};
`

export const SelectIcon = styled(ChevronDown)`
  display: block;
  width: ${themeSpacing(3)};
  height: ${themeSpacing(3)};
  margin-left: ${themeSpacing(3)};
`

export const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  padding: ${themeSpacing(2, 3)};
  font-size: 1rem;
  border: 1px solid ${themeColor('tint', 'level5')};
  border-radius: 0;
  background-color: ${themeColor('tint', 'level1')};
  cursor: pointer;
  &:hover {
    ${({ disabled }) =>
      !disabled &&
      css`
        border: 1px solid ${themeColor('tint', 'level7')};
      `}
  }
`
