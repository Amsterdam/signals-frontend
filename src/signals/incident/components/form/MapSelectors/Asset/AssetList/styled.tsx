import { Button, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { FeatureStatus } from '../../types'

export const StyledStatusDescription = styled.div<{ status?: string }>`
  color: ${({ status }) =>
    status === FeatureStatus.REPORTED
      ? themeColor('secondary')
      : themeColor('support', 'valid')};
`

export const StyledLabel = styled.div`
  margin: 0 ${themeSpacing(2)};
  font-weight: bold;
  flex: 1;
`

export const SelectionNearby = styled.div`
  margin: ${themeSpacing(3, 0, 0)};
  strong {
    font-weight: bold;
    margin: ${themeSpacing(6, 0, 3)};
    color: ${themeColor('secondary')};
  }
  p {
    display: block;
    margin: ${themeSpacing(2, 0, 0)};
  }
  span {
    display: block;
    margin-bottom: ${themeSpacing(3)};
  }
`

export const ListHeading = styled.p`
  font-weight: 700;
`

export const ListItem = styled.div`
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
`

export const StyledButton = styled(Button).attrs(() => ({
  type: 'button',
  variant: 'blank',
  size: 32,
  iconSize: 12,
}))`
  margin-right: 2px;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  min-width: auto;
`
