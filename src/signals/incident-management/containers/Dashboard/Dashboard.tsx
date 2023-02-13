// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useState } from 'react'

import GlobalError from 'components/GlobalError'

import { AreaChart } from './components'
import { BarChart } from './components/BarChart'
import { Filter } from './components/Filter'
import { StyledRow } from './styled'

const Dashboard = () => {
  const [error] = useState<boolean>(false)
  const [showMessage, setShowMessage] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<JSX.Element | string>('')
  const [queryString, setQueryString] = useState<string>('')

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
      <Filter callback={setQueryString} />
      <BarChart queryString={queryString} />
      <AreaChart queryString={queryString} />
      {errorMessage && showMessage && <GlobalError>{errorMessage}</GlobalError>}
    </StyledRow>
  )
}

export default Dashboard
