// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import GlobalError from 'components/GlobalError'

import { AreaChart } from './components'
import { Filter } from './components/Filter'
import { StyledRow } from './styled'
import { INCIDENTS_URL } from '../../routes'

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
      setNotification('Er kan geen data worden geladen. Vernieuw de pagina.')
    }
  }, [error, setNotification])

  return (
    <StyledRow data-testid="menu">
      <Filter />
      <Link to={{ pathname: INCIDENTS_URL, state: { useBacklink: true } }}>
        <AreaChart />
      </Link>
      {errorMessage && showMessage && <GlobalError>{errorMessage}</GlobalError>}
    </StyledRow>
  )
}

export default Dashboard
