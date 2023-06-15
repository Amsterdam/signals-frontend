import { themeColor, Icon } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const ColumnDescription = styled.div`
  margin-left: 26px;
`

export const ColumnStatus = styled.div`
  margin-bottom: 4px;
`

export const Status = styled.span`
  color: ${themeColor('tint', 'level5')};
  font-weight: 700;
  line-height: 16px;
`

export const StyledIcon = styled(Icon)`
  margin: 0 14px 0 0;
  display: inline-block;
`

export const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  margin-bottom: 8px;
`

export const Text = styled.div`
  font-weight: 400;
  line-height: 16px;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Wrapper = styled.div`
  margin-bottom: 24px;
`
