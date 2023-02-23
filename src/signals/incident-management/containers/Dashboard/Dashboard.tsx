// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useState } from 'react'

import { AreaChart, BarChart, Filter } from './components'
import { StyledRow, Wrapper } from './styled'

const Dashboard = () => {
  const [queryString, setQueryString] = useState<string>('')

  return (
    <>
      <StyledRow data-testid="menu">
        <Filter callback={setQueryString} />
      </StyledRow>
      <Wrapper data-testid="menu">
        <BarChart queryString={queryString} />
        <AreaChart />
      </Wrapper>
    </>
  )
}

export default Dashboard
