import { Button, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export interface Props {
  isOpen?: boolean
}

export interface ButtonContentProps {
  noMultiline?: boolean
}

const AccordionContent = styled.div<Props>`
  transition: border-color 0.1s ease-in-out;
  border: 2px solid ${themeColor('tint', 'level3')};
  border-top: none;
  padding: ${themeSpacing(4)};
  display: ${({ isOpen }) => !isOpen && 'none'};
`

const AccordionButtonContent = styled.span<ButtonContentProps>`
  text-align: left;
  ${({ noMultiline }) =>
    noMultiline
      ? css`
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 20px;
        `
      : css`
          white-space: normal;
        `}
`

const AccordionButton = styled(Button)<Props>`
  width: 100%;
  height: initial;
  background-color: ${themeColor('tint', 'level3')};

  &:hover,
  &&:focus {
    background-color: ${themeColor('tint', 'level4')};

    & + ${AccordionContent} {
      border-color: ${themeColor('tint', 'level4')};
    }
  }

  svg {
    align-self: flex-start;
    margin-left: auto;
    transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
    transition: transform 0.3s ease;
  }
`

export { AccordionButton, AccordionContent, AccordionButtonContent }
