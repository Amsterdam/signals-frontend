import { themeSpacing, TopTaskLink } from '@amsterdam/asc-ui'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  column-gap: ${themeSpacing(8)};
  row-gap: ${themeSpacing(4)};
`

export const Item = styled.div``

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
