import { Column, themeColor } from '@amsterdam/asc-ui'
import { CompactPager } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledColumn = styled(Column)`
  display: flex;
  flex-direction: column;
`
export const StyledPagination = styled(CompactPager)`
  background-color: ${themeColor('tint', 'level1')};
  margin-top: 24px;
  max-width: 200px;
`
