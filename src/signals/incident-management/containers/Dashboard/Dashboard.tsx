// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useEffect, useMemo, useState } from 'react'

import { capitalize } from 'lodash'
import { Link, Route, useLocation, useHistory } from 'react-router-dom'

import { Tab } from 'components/Tab'

import { AreaChart, BarChart, Filter, Signaling } from './components'
import { FilterWrapper, StyledRow, StyledTabContainer } from './styled'
import configuration from '../../../../shared/services/configuration/configuration'
import { DASHBOARD_URL } from '../../routes'

const Dashboard = () => {
  const [queryString, setQueryString] = useState<string>('')

  const location = useLocation()

  const history = useHistory()

  const pages = useMemo(
    () => ({
      nu: `${DASHBOARD_URL}/nu`,
      signalering: `${DASHBOARD_URL}/signalering`,
    }),
    []
  )

  useEffect(() => {
    if (location.pathname === DASHBOARD_URL) {
      history.push(pages.nu)
    }
  }, [history, location.pathname, pages])

  return (
    <>
      <FilterWrapper data-testid="menu">
        <Filter setQueryString={setQueryString} />
      </FilterWrapper>
      <StyledRow>
        <StyledTabContainer>
          {Object.entries(pages).map(([name, url]) => (
            <Tab
              key={name}
              className={url === location.pathname ? 'active' : ''}
              as={Link}
              to={url}
            >
              {capitalize(name)}
            </Tab>
          ))}
        </StyledTabContainer>
      </StyledRow>
      <Route path={`${DASHBOARD_URL}/nu`}>
        <StyledRow>
          <BarChart queryString={queryString} />
          <AreaChart />
        </StyledRow>
      </Route>
      {!configuration.featureFlags.showDashboard && (
        <Route path={`${DASHBOARD_URL}/signalering`}>
          <StyledRow>
            <Signaling />
          </StyledRow>
        </Route>
      )}
    </>
  )
}

export default Dashboard
