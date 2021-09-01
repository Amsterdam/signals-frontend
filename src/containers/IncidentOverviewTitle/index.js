// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import * as types from 'shared/types'

import PageHeader from 'components/PageHeader'
import {
  makeSelectActiveFilter,
  makeSelectIncidentsCount,
} from 'signals/incident-management/selectors'
import { makeSelectSearchQuery } from 'containers/App/selectors'

import Refresh from '../../shared/images/icon-refresh.svg'

const RefreshIcon = styled(Refresh).attrs({
  height: 30,
})`
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
`

export const IncidentOverviewTitle = ({ filter, incidentsCount, query }) => {
  const headerTitle = useMemo(() => {
    let title = filter.name || 'Meldingen'
    const hasCount = incidentsCount !== null && incidentsCount >= 0
    title += hasCount ? ` (${incidentsCount.toLocaleString('nl-NL')})` : ''

    return filter.refresh ? (
      <Fragment>
        <RefreshIcon role="img" aria-label="Ververst automatisch" /> {title}
      </Fragment>
    ) : (
      title
    )
  }, [filter, incidentsCount])

  const subTitle = useMemo(
    () => query && `Zoekresultaten voor "${query}"`,
    [query]
  )

  return <PageHeader title={headerTitle} subTitle={subTitle} />
}

IncidentOverviewTitle.defaultProps = {
  children: null,
}

IncidentOverviewTitle.propTypes = {
  filter: types.filterType,
  children: PropTypes.node,
  incidentsCount: PropTypes.number,
  query: PropTypes.string,
}

const mapStateToProps = createStructuredSelector({
  filter: makeSelectActiveFilter,
  incidentsCount: makeSelectIncidentsCount,
  query: makeSelectSearchQuery,
})

const withConnect = connect(mapStateToProps)

export default compose(withConnect)(IncidentOverviewTitle)
