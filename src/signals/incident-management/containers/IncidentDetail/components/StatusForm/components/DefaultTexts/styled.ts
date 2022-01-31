import styled, { css } from 'styled-components'
import {
  Link,
  Heading,
  themeColor,
  themeSpacing,
  Button,
} from '@amsterdam/asc-ui'

export const CloseButton = styled(Button)`
  border: none;
  padding: 0;
  width: 20px;
  height: 20px;
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${themeSpacing(3, 4, 3, 4)};
  margin: 0;
  border-bottom: 1px solid ${themeColor('tint', 'level5')};
`

export const StyledDefaultText = styled.div<{ empty?: boolean }>`
  margin-bottom: ${themeSpacing(5)};

  ${({ empty }) =>
    empty &&
    css`
      color: ${themeColor('tint', 'level5')};
    `}
`

export const StyledHeading = styled(Heading)`
  margin: 0;
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
