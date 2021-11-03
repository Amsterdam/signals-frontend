import styled from 'styled-components'
import {
  themeColor,
  themeSpacing,
  TextArea as AscTextArea,
} from '@amsterdam/asc-ui'
import ErrorMessage, { ErrorWrapper } from 'components/ErrorMessage'

const lineHeight = 22
const infoFontSize = 14

export const StyledErrorMessage = styled(ErrorMessage)`
  margin-bottom: ${themeSpacing(2)};
`

export const StyledArea = styled(AscTextArea)<{
  rows?: number
  maxRows?: number
}>`
  margin-top: ${themeSpacing(1)};
  font-family: inherit;
  vertical-align: top; /* https://stackoverflow.com/questions/7144843/extra-space-under-textarea-differs-along-browsers */
  min-height: ${({ rows = 5 }) => rows * lineHeight}px;
  resize: vertical;
  max-height: ${({ maxRows = 15 }) => maxRows * lineHeight}px;
  line-height: ${lineHeight}px;
`

export const InfoText = styled.div`
  color: ${themeColor('tint', 'level5')};
  margin-top: ${themeSpacing(2)};
  font-size: ${infoFontSize}px;
`

export { ErrorWrapper }
