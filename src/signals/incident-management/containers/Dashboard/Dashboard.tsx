// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Filter } from './components/Filter'
import { StyledRow } from './styled'
import BarChart from './components/barchart'


const Dashboard = () => (
  <StyledRow data-testid="menu">
    <Filter />
  </StyledRow>
   <BarChart />
)

export default Dashboard
