// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { breakpoint } from '@amsterdam/asc-ui'

import Button from 'components/Button'
import { postMessage } from 'containers/App/actions'
import { useCallback } from 'react'

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
const AppCloseButtonComponent = ({ meta }: AppCloseButtonProps) => {
  const dispatch = useDispatch()

  const handleClose = useCallback(() => {
    dispatch(postMessage('close'))
  }, [dispatch])

  return (
    <StyledButton onClick={handleClose} type="button">
      {meta.label}
    </StyledButton>
  )
}

const AppCloseButton = (props: AppCloseButtonProps) => (
  <AppCloseButtonComponent {...props} />
)

export default AppCloseButton
