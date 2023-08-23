import { RadioGroup, Label, themeSpacing, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const FilterGroup = styled.div`
  contain: content;
  position: relative;

  & + & {
    margin-top: 30px;
  }
`

export const StyledLabel = styled(Label)`
  align-self: baseline;

  * {
    font-weight: normal;
  }
`

export const StyledRadioGroup = styled(RadioGroup)`
  display: inline-flex;
`

export const OptionCount = styled.span`
  color: ${themeColor('tint', 'level5')};
  margin-left: ${themeSpacing(1)};
  order: 2;
`
