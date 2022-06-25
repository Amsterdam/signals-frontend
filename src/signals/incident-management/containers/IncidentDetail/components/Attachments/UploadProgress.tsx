import styled from 'styled-components'
import { themeColor } from '@amsterdam/asc-ui'

interface StyledUploadProgressProps {
  progress: number
}

const StyledUploadProgress = styled.div<StyledUploadProgressProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height 5px;
  background-color: ${themeColor('tint', 'level4')};

  &::after {
    content: '';
    display: block;
    width: ${({ progress }) => progress * 100}%;
    height: 100%;
    background-color: ${themeColor('primary')};
  }
`

export default StyledUploadProgress
