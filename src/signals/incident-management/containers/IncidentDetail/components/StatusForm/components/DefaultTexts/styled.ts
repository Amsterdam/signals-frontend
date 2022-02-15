import styled, { css } from 'styled-components'
import { Link, themeColor, themeSpacing } from '@amsterdam/asc-ui'

export const StyledDefaultText = styled.div<{ empty?: boolean }>`
  margin-bottom: ${themeSpacing(5)};

  ${({ empty }) =>
    empty &&
    css`
      color: ${themeColor('tint', 'level5')};
    `}
`

export const StyledLink = styled(Link)`
  font-size: ${themeSpacing(4)};
  margin-top: ${themeSpacing(2)};
  text-decoration: underline;
  display: inline-block;
  cursor: pointer;
`

export const StyledTitle = styled.div`
  font-weight: 700;
  margin-bottom: ${themeSpacing(2)};
`

export const Wrapper = styled.div`
  padding: ${themeSpacing(5, 3, 5, 3)};
`
