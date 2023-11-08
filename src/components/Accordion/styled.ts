/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2023 Gemeente Amsterdam */
import { Button as AscButton, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const darkBlue = '#102e62'
export interface Props {
  isOpen?: boolean
}

export const Wrapper = styled.div<Props>`
  border: ${({ isOpen }) =>
    isOpen ? `1px solid ${darkBlue}` : '1px solid transparent'};
  margin-bottom: 4px;

  &:hover {
    border: 1px solid ${darkBlue};
  }
`

export const Border = styled.div<Props>`
  border: 1px solid transparent;

  &:hover {
    border: 1px solid ${darkBlue};
  }
`

export const Button = styled(AscButton)<Props>`
  width: 100%;
  box-sizing: border-box;
  font-size: 1.125rem;
  font-family: 'Amsterdam Sans', sans-serif;
  svg {
    transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
    transition: transform 0.3s ease;
  }

  &:hover {
    color: ${darkBlue};
  }
`

export const ButtonContent = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  padding: ${themeSpacing(3, 4)};
  text-align: left;
  white-space: normal;
  width: 100%;

  &:hover {
    svg path {
      fill: ${darkBlue};
    }
  }
`

export const Content = styled.div<Props>`
  transition: border-color 0.1s ease-in-out;
  padding: ${themeSpacing(0, 4)};
  display: ${({ isOpen }) => !isOpen && 'none'};
`
