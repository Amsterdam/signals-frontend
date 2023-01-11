// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useState } from 'react'

import { Alert } from '@amsterdam/asc-assets'

import { StyledRow } from './styled'

const Dashboard = () => {
  const [error] = useState<boolean>(false)
  const [showMessage, setShowMessage] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<JSX.Element | string>('')

  const setNotification = useCallback(
    (message: JSX.Element | string) => {
      setErrorMessage(message)
      setShowMessage(true)
    },
    [setErrorMessage, setShowMessage]
  )
  useEffect(() => {
    if (error) {
      setNotification('Er is iets misgegaan met het data ophalen.')
    }
  }, [error, setNotification])
  return (
    <>
      <StyledRow data-testid="menu">
        <div>menu</div>
      </StyledRow>
      {errorMessage && showMessage && <Alert>{errorMessage}</Alert>}
    </>
  )
}

export default Dashboard
