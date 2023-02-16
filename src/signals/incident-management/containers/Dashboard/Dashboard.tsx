// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useState } from 'react'

import { Row } from '@amsterdam/asc-ui'

import { AreaChart, BarChart, Filter } from './components'
import { StyledRow } from './styled'

const Dashboard = () => {
  const [queryString, setQueryString] = useState<string>('')

  return (
    <>
      <StyledRow data-testid="menu">
        <Filter callback={setQueryString} />
      </StyledRow>
      <Row data-testid="menu">
        <BarChart />
        <AreaChart queryString={queryString} />
      </Row>
    </>
  )
}

export default Dashboard
