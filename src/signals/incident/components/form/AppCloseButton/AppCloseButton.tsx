// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { FunctionComponent } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { breakpoint } from '@amsterdam/asc-ui'

import Button from 'components/Button'
import { postMessage } from 'containers/App/actions'

const StyledButton = styled(Button).attrs({
  variant: 'primary',
})`
  @media ${breakpoint('min-width', 'tabletS')} {
    width: 150px;
  }
`

interface AppCloseButtonProps {
  meta: {
    label: string
  }
}

/**
 * Button to facilitate closing the application when in 'appMode'.
 */
const AppCloseButtonComponent: FunctionComponent<AppCloseButtonProps> = ({
  meta,
}) => {
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(postMessage('close'))
  }

  return (
    <StyledButton onClick={handleClose} type="button">
      {meta.label}
    </StyledButton>
  )
}

const AppCloseButton: FunctionComponent<AppCloseButtonProps> = (props) => (
  <AppCloseButtonComponent {...props} />
)

export default AppCloseButton
