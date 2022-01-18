import styled from 'styled-components'
import { Paragraph as AscParagraph, themeColor } from '@amsterdam/asc-ui'

const Paragraph = styled(AscParagraph)<{ light?: boolean }>`
  font-size: 16px;
  margin-bottom: 0;
  color: ${({ light = false }) =>
    light ? themeColor('tint', 'level5') : themeColor('tint', 'level7')};
`

export default Paragraph
