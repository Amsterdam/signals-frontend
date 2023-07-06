import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const CategoryColumns = styled.div`
  flex: 1;
  column-count: 1;
  column-gap: 60px;
  margin-bottom: ${themeSpacing(
    24.5
  )}; // add 2 rem on top of the height of the form footer

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    column-count: 2;
    column-gap: 100px;
  }
`
