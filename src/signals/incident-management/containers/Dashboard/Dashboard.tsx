// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
// import { useCallback, useEffect, useState } from 'react'
//
// import GlobalError from 'components/GlobalError'

import { Filter } from './components/Filter'
import { StyledRow } from './styled'

const Dashboard = () => {
  // Currently the implementation is commented out, cause its incomplete.
  // the commented lines are just a start to help for starting https://gemeente-amsterdam.atlassian.net/browse/SIG-4900?atlOrigin=eyJpIjoiZWNkZGU1YTFjZDkwNDQxZWI2MzU3MmE1Njc3MGJhNTciLCJwIjoiaiJ9

  // const [error] = useState<boolean>(false)
  // const [showMessage, setShowMessage] = useState<boolean>(false)
  // const [errorMessage, setErrorMessage] = useState<JSX.Element | string>('')
  //
  // const setNotification = useCallback(
  //   (message: JSX.Element | string) => {
  //     setErrorMessage(message)
  //     setShowMessage(true)
  //   },
  //   [setErrorMessage, setShowMessage]
  // )
  //
  // useEffect(() => {
  //   if (error) {
  //     setNotification('Er kan geen data worden geladen. Vernieuw de pagina.')
  //   }
  // }, [error, setNotification])

  return (
    <>
      <StyledRow data-testid="menu">
        <Filter />
      </StyledRow>
      {/*
        This is a test background to demonstrate how the collapsed fills the view container when the body is bigger then 100vh*
        remove when implementing SIG-4900
      */}
      <div style={{ background: 'red', height: '200vh' }}>asdf</div>
      {/*{errorMessage && showMessage && <GlobalError>{errorMessage}</GlobalError>}*/}
    </>
  )
}

export default Dashboard
