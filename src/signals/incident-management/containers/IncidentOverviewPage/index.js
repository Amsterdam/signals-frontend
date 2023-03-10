// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { useEffect, useState, useCallback, useMemo, useContext } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { compose, bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import LoadingIndicator from 'components/LoadingIndicator'
import Modal from 'components/Modal'
import OverviewMap from 'components/OverviewMap'
import PageHeader from 'containers/IncidentOverviewTitle'
import MapContext from 'containers/MapContext'
import useEventEmitter from 'hooks/useEventEmitter'
import * as types from 'shared/types'
import {
  orderingChanged,
  pageChanged,
  clearFilters,
  applyFilter,
} from 'signals/incident-management/actions'
import { FILTER_PAGE_SIZE } from 'signals/incident-management/constants'
import Filter from 'signals/incident-management/containers/Filter'
import MyFilters from 'signals/incident-management/containers/MyFilters'
import dataLists from 'signals/incident-management/definitions'
import {
  makeSelectActiveFilter,
  makeSelectFiltersOnOverview,
  makeSelectIncidents,
  makeSelectOrdering,
  makeSelectPage,
} from 'signals/incident-management/selectors'
import { parseToAPIData } from 'signals/shared/filter/parse'

import List from './components/List'
import QuickFilter from './components/QuickFilter'
import Sort from './components/Sort'
import SubNav from './components/SubNav'
import {
  TitleRow,
  PageHeaderItem,
  ButtonWrapper,
  PaginationWrapper,
  MapWrapper,
  NavWrapper,
  NoResults,
  StyledButton,
  StyledPagination,
  StyledBackLink,
} from './styled'
import IncidentManagementContext from '../../context'
import { DASHBOARD_URL, INCIDENTS_URL, MAP_URL } from '../../routes'
import FilterTagList from '../FilterTagList/FilterTagList'

let lastActiveElement = null

export const IncidentOverviewPageContainerComponent = ({
  applyFilterAction,
  activeFilter,
  clearFiltersAction,
  filters,
  incidents,
  ordering,
  orderingChangedAction,
  page,
  pageChangedAction,
}) => {
  const { listenFor, unlisten } = useEventEmitter()
  const [modalFilterIsOpen, toggleFilterModal] = useState(false)
  const [modalMyFiltersIsOpen, toggleMyFiltersModal] = useState(false)
  const { count, loadingIncidents, results } = incidents
  const location = useLocation()
  const showsMap = location.pathname === MAP_URL

  const openMyFiltersModal = useCallback(() => {
    disablePageScroll()
    toggleMyFiltersModal(true)
    lastActiveElement = document.activeElement
  }, [toggleMyFiltersModal])

  const closeMyFiltersModal = useCallback(() => {
    enablePageScroll()
    toggleMyFiltersModal(false)

    /* istanbul ignore next */
    if (lastActiveElement) {
      lastActiveElement.focus()
    }
  }, [toggleMyFiltersModal])

  const openFilterModal = useCallback(() => {
    disablePageScroll()
    toggleFilterModal(true)
    lastActiveElement = document.activeElement
  }, [toggleFilterModal])

  const closeFilterModal = useCallback(() => {
    enablePageScroll()
    toggleFilterModal(false)

    /* istanbul ignore next */
    if (lastActiveElement) {
      lastActiveElement.focus()
    }
  }, [toggleFilterModal])

  const escFunction = useCallback(
    (event) => {
      /* istanbul ignore next */
      if (event.keyCode === 27) {
        closeFilterModal()
        closeMyFiltersModal()
      }
    },
    [closeFilterModal, closeMyFiltersModal]
  )

  const handleSetFilter = (filter) => {
    applyFilterAction(parseToAPIData(filter))
  }

  const { dashboardFilter } = useContext(IncidentManagementContext)

  const validDashboardFilterOptions = useMemo(
    () =>
      dashboardFilter &&
      Object.fromEntries(
        Object.entries(dashboardFilter)
          .filter(([k, v]) => (v.value || k === 'status') && k !== 'department')
          .map(([k, v]) =>
            k === 'punctuality' || k === 'status'
              ? [k, v.value]
              : [k, [v.value]]
          )
      ),
    [dashboardFilter]
  )

  useEffect(() => {
    if (location.state?.useDashboardFilters) {
      applyFilterAction({ options: validDashboardFilterOptions })
    }
  }, [location, applyFilterAction, validDashboardFilterOptions])

  const history = useHistory()

  useEffect(() => {
    const unlisten = history.listen((newLocation) => {
      if (newLocation.pathname.includes(INCIDENTS_URL)) {
        newLocation.state = location.state
      } else {
        newLocation.state = {}
      }
    })
    return () => unlisten()
  }, [history, location])

  useEffect(() => {
    listenFor('keydown', escFunction)
    listenFor('openFilter', openFilterModal)

    return () => {
      unlisten('keydown', escFunction)
      unlisten('openFilter', openFilterModal)
    }
  }, [escFunction, openFilterModal, listenFor, unlisten])

  const totalPages = useMemo(() => Math.ceil(count / FILTER_PAGE_SIZE), [count])

  const canRenderList = results && results.length > 0 && totalPages > 0

  const hasActiveFilters = activeFilter.options
    ? Boolean(
        Object.keys(activeFilter.options).find(
          (key) => activeFilter.options[key].length > 0
        )
      )
    : false

  const pagination =
    !showsMap && totalPages > 1 ? (
      <StyledPagination
        data-testid="pagination"
        collectionSize={count}
        pageSize={FILTER_PAGE_SIZE}
        page={page}
        onPageChange={(page) => {
          global.window.scrollTo(0, 0)
          pageChangedAction(page)
        }}
      />
    ) : null

  return (
    <div
      className="incident-overview-page"
      data-testid="incident-management-overview-page"
    >
      <Row>
        {location.state?.useDashboardFilters &&
          !isEmpty(validDashboardFilterOptions) && (
            <StyledBackLink
              to={{
                pathname: DASHBOARD_URL,
              }}
            >
              Terug naar dashboard
            </StyledBackLink>
          )}
        <TitleRow>
          <PageHeader />
          {(!location.state?.useDashboardFilters ||
            isEmpty(validDashboardFilterOptions)) && (
            <ButtonWrapper>
              <StyledButton
                data-testid="my-filters-modal-btn"
                color="primary"
                onClick={openMyFiltersModal}
              >
                Mijn filters
              </StyledButton>

              <StyledButton
                data-testid="filter-modal-btn"
                color="primary"
                onClick={openFilterModal}
              >
                Filter
              </StyledButton>
            </ButtonWrapper>
          )}
        </TitleRow>

        {modalMyFiltersIsOpen && (
          <Modal
            data-testid="my-filters-modal"
            onClose={closeMyFiltersModal}
            isOpen
            title="Mijn filters"
          >
            <MyFilters onClose={closeMyFiltersModal} />
          </Modal>
        )}

        {modalFilterIsOpen && (
          <Modal
            data-testid="filter-modal"
            isOpen
            onClose={closeFilterModal}
            title="Filters"
          >
            <Filter onSubmit={closeFilterModal} onCancel={closeFilterModal} />
          </Modal>
        )}

        <Column span={12}>
          <QuickFilter filters={filters} setFilter={handleSetFilter} />
        </Column>

        <Column span={12}>
          {hasActiveFilters && (
            <PageHeaderItem>
              <FilterTagList
                tags={activeFilter.options}
                onClear={clearFiltersAction}
              />
            </PageHeaderItem>
          )}
        </Column>

        <NavWrapper>
          {!showsMap && (
            <>
              {pagination}
              <Sort
                activeOrdering={ordering}
                onChangeOrdering={orderingChangedAction}
              />
            </>
          )}
          <SubNav showsMap={showsMap} />
        </NavWrapper>
      </Row>

      {showsMap && (
        <Row>
          <MapWrapper>
            <MapContext>
              <OverviewMap
                data-testid="24-hour-map"
                refresh={activeFilter.refresh}
              />
            </MapContext>
          </MapWrapper>
        </Row>
      )}

      {!showsMap && (
        <Row>
          <Column span={12}>
            {loadingIncidents && <LoadingIndicator size={100} />}

            {canRenderList && (
              <List
                incidents={incidents.results}
                incidentsCount={count}
                isLoading={loadingIncidents}
                {...dataLists}
              />
            )}

            {count === 0 && <NoResults>Geen meldingen</NoResults>}
          </Column>

          <PaginationWrapper>{pagination}</PaginationWrapper>
        </Row>
      )}
    </div>
  )
}

IncidentOverviewPageContainerComponent.defaultProps = {
  activeFilter: {},
  filters: [],
  incidents: {},
  page: 1,
}

IncidentOverviewPageContainerComponent.propTypes = {
  activeFilter: types.filterType,
  clearFiltersAction: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(types.filterType),
  incidents: PropTypes.shape({
    count: PropTypes.number,
    loadingIncidents: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  orderingChangedAction: PropTypes.func.isRequired,
  pageChangedAction: PropTypes.func.isRequired,
  ordering: PropTypes.string.isRequired,
  page: PropTypes.number,
}

const mapStateToProps = createStructuredSelector({
  activeFilter: makeSelectActiveFilter,
  filters: makeSelectFiltersOnOverview,
  incidents: makeSelectIncidents,
  ordering: makeSelectOrdering,
  page: makeSelectPage,
})

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      applyFilterAction: applyFilter,
      clearFiltersAction: clearFilters,
      orderingChangedAction: orderingChanged,
      pageChangedAction: pageChanged,
    },
    dispatch
  )

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(IncidentOverviewPageContainerComponent)
