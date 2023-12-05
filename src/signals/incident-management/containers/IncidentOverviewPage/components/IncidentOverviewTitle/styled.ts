import { Link, Paragraph, themeSpacing, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Refresh from '../../../../../../images/icon-refresh.svg'

export const SubTitle = styled(Paragraph)`
  margin: ${themeSpacing(3)} 0;
  line-height: 1.5rem;
  font-size: 1rem;
`

export const RefreshIcon = styled(Refresh).attrs({
  height: 30,
})`
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
`

export const StyledLink = styled(Link)`
  margin-left: ${themeSpacing(2)};
  color: ${themeColor('primary')};
  font-size: 1rem;
  line-height: 1.5rem;

  :hover {
    color: ${themeColor('primary', 'dark')};
    cursor: pointer;
  }
`

export const StyledSpan = styled.span`
  line-height: 1.5rem;
`
