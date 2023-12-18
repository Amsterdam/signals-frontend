import { ChevronUp } from '@amsterdam/asc-assets'
import styled, { css } from 'styled-components'

export const Chevron = styled(ChevronUp)<{ $rotated: boolean }>`
  transition: transform 0.25s;
  ${({ $rotated }) =>
    $rotated &&
    css`
      transform: rotate(180deg);
    `}
`
