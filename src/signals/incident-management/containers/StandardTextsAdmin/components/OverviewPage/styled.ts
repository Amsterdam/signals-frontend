import { Column, themeColor } from '@amsterdam/asc-ui'
import { CompactPager } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Button from 'components/Button'

export const StyledColumn = styled(Column)`
  display: flex;
  flex-direction: column;
  justify-content: unset;
`
export const StyledPagination = styled(CompactPager)`
  background-color: ${themeColor('tint', 'level1')};
  margin-top: 24px;
  max-width: 200px;
`

export const StyledButton = styled(Button)`
  width: fit-content;
`
