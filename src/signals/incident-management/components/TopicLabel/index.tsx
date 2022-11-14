import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const TopicLabel = styled.label`
  margin: ${themeSpacing(1)} 0;
  font-weight: 700;
  display: block;
  &:first-of-type {
    margin-top: ${themeSpacing(3)};
  }
`

export default TopicLabel
