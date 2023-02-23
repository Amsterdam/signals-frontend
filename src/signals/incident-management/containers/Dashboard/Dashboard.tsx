// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useState } from 'react'

import { AreaChart, BarChart, Filter } from './components'
import { FilterWrapper, StyledRow } from './styled'

const Dashboard = () => {
  const [queryString, setQueryString] = useState<string>('')

  return (
    <>
      <FilterWrapper data-testid="menu">
        <Filter callback={setQueryString} />
      </FilterWrapper>
      <StyledRow>
        <BarChart queryString={queryString} />
        <AreaChart />
      </StyledRow>
    </>
  )
}

export default Dashboard
