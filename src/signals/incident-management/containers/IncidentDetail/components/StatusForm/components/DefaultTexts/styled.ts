import styled, { css } from 'styled-components'
import { Link, themeColor, themeSpacing } from '@amsterdam/asc-ui'

export const StyledDefaultText = styled.div<{ empty?: boolean }>`
  margin-bottom: ${themeSpacing(8)};

  ${({ empty }) =>
    empty &&
    css`
      color: ${themeColor('tint', 'level5')};
    `}
`

export const StyledLink = styled(Link)`
  cursor: pointer;
  display: inline-block;
  font-size: ${themeSpacing(4)};
  margin: ${themeSpacing(1, 0, 0)};
  text-decoration: underline;
`

export const StyledTitle = styled.div`
  font-weight: 700;
  margin-bottom: ${themeSpacing(1)};
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const Wrapper = styled.div`
  padding: ${themeSpacing(5, 4)};
  overflow: auto;
  height: 100%;
`
