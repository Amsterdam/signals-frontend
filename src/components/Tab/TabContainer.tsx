import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const TabContainer = styled.div.attrs(() => ({
  role: 'tablist',
}))`
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
  display: flex;
  padding-bottom: ${themeSpacing(1)};

  a {
    text-decoration: none;
  }
`
