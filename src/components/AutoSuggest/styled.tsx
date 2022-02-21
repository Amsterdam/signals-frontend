import styled, { css } from 'styled-components'

import InputBase from 'components/Input'
import { Button } from '@amsterdam/asc-ui'
import SuggestList from './components/SuggestList'

export const Wrapper = styled.div`
  position: relative;
`

export const Input = styled(InputBase)<{ defaultValue?: string }>`
  border: 1px solid;

  & input {
    border: 0;
    ${({ defaultValue }) =>
      defaultValue &&
      css`
        padding-right: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
      `}
  }

  & > * {
    margin: 0;
  }
`

export const List = styled(SuggestList)`
  position: absolute;
  width: 100%;
  background-color: white;
  z-index: 2;
`

export const ClearInput = styled(Button)`
  position: absolute;
  top: 11px;
  right: 11px;
`
