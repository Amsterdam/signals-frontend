// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Filter } from './components/Filter'
import { StyledRow } from './styled'

const Dashboard = () => (
  <StyledRow data-testid="menu">
    <Filter />
  </StyledRow>
)

export default Dashboard
