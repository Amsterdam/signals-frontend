import { themeSpacing, TopTaskLink } from '@amsterdam/asc-ui'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const Item = styled.div`
  flex: 1;
  padding-right: ${themeSpacing(8)};
  &:last-of-type {
    padding-right: 0;
  }
`

export const StyledNavLink = styled(NavLink)`
  margin-bottom: ${themeSpacing(4)};
  display: block;
  text-decoration: none;
`

export const StyledTopTaskLink = styled(TopTaskLink)`
  min-height: 132px;
  font-weight: 700;
`

export const StyledVersionNumbers = styled.span`
  white-space: pre-line;
`
