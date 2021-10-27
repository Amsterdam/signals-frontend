import styled, { css } from 'styled-components'
import { Link, Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'

export const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(2)};
`

export const StyledDefaultText = styled.div<{ empty?: boolean }>`
  background-color: ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(3)};
  margin-bottom: ${themeSpacing(1)};

  ${({ empty }) =>
    empty &&
    css`
      color: ${themeColor('tint', 'level5')};
    `}
`

export const StyledTitle = styled.div`
  font-family: 'Avenir Next LT W01 Demi';
  margin-bottom: ${themeSpacing(2)};
`

export const StyledLink = styled(Link)`
  font-size: ${themeSpacing(4)};
  margin-top: ${themeSpacing(2)};
  text-decoration: underline;
  display: inline-block;
  cursor: pointer;
`
