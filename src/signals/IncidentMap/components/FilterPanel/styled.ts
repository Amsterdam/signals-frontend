// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import {
  Button,
  breakpoint,
  Label,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export const StyledLabel = styled(Label)`
  font-weight: normal;
`

export const StyledImg = styled.img`
  padding-right: ${themeSpacing(2)};
  padding: ${themeSpacing(2, 0)};
  padding-right: 6px;
  max-height: ${themeSpacing(8)};
`
export const Wrapper = styled.div`
  border-top: 1px solid ${themeColor('tint', 'level3')};
`
export const StyledButton = styled(Button)`
  position: absolute;
  top: ${themeSpacing(5)};
  left: calc(33% - ${themeSpacing(2)});
  z-index: 3;
  width: ${themeSpacing(9)};
  box-shadow: ${themeSpacing(1)} ${themeSpacing(1)} ${themeSpacing(1)}
    rgba(0, 0, 0, 0.1);

  &.hiddenPanel {
    left: 0;
  }

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    transform: rotate(-90deg);
    top: calc(50% - ${themeSpacing(3)});
    left: calc(50% - 18px);
    box-shadow: ${themeSpacing(0)} ${themeSpacing(0)} ${themeSpacing(0)}
      rgba(0, 0, 0, 0.1);

    &.hiddenPanel {
      left: calc(50% - 18px);
      top: calc(100% - ${themeSpacing(11)});
      box-shadow: ${themeSpacing(1)} ${themeSpacing(1)} ${themeSpacing(1)}
        rgba(0, 0, 0, 0.1);
    }
  }
`

export const SubSection = styled.div<{ visible: boolean; lines: number }>`
  padding-left: ${themeSpacing(4)};
  max-height: 0;
  transition: max-height 0.15s ease-out;
  overflow: hidden;

  ${({ visible, lines }) =>
    visible
      ? /*lines time 5 because line wrapped labels, setting needs to be above real height (to avoid clipping) but way too
  high gives wonky expand/collapse effect. See https://css-tricks.com/using-css-transitions-auto-dimensions/*/
        css`
          max-height: ${5 * lines}em;
          transition: max-height 0.25s ease-in;
        `
      : css`
          visibility: hidden;
        `}
`

export const WrapperFilterCategoryWithIcon = styled.div`
  > label {
    width: calc(100% - 20px);
  }

  display: flex;
  align-items: center;
  border-top: 1px solid ${themeColor('tint', 'level3')};
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  &:first-child {
    border: none;
  }
`

export const InvisibleButton = styled.button<{ toggle: boolean }>`
  text-decoration: none;
  background-color: unset;
  color: inherit;
  border: none;
  padding: 0px;

  > * {
    transition: transform 0.25s;

    ${({ toggle }) =>
      toggle &&
      css`
        transform: rotate(180deg);
      `}
  }
`

export const CategoryItemText = styled.span`
  display: flex;
  align-items: center;
`

export const CategoryItem = styled.label`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  margin-left: -6px;
`
