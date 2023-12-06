// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { useEffect, useState, useCallback, useMemo } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { connect, useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { compose, bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import LoadingIndicator from 'components/LoadingIndicator'
import Modal from 'components/Modal'
import OverviewMap from 'components/OverviewMap'
import { showGlobalNotification } from 'containers/App/actions'
import { makeSelectSearchQuery } from 'containers/App/selectors'
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
import PageHeader from 'signals/incident-management/containers/IncidentOverviewPage/components/IncidentOverviewTitle'
import MyFilters from 'signals/incident-management/containers/MyFilters'
import dataLists from 'signals/incident-management/definitions'
import {
  makeSelectActiveFilter,
  makeSelectErrorMessage,
  makeSelectFiltersOnOverview,
  makeSelectIncidents,
  makeSelectOrdering,
  makeSelectPage,
} from 'signals/incident-management/selectors'
import { parseToAPIData } from 'signals/shared/filter/parse'

import List from './components/List'
import QuickFilter from './components/QuickFilter'
import SubNav from './components/SubNav'
import { TYPE_GLOBAL, VARIANT_NOTICE } from './contants'
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
} from './styled'
import {
  TYPE_LOCAL,
  VARIANT_ERROR,
} from '../../../../containers/Notification/constants'
import { MAP_URL } from '../../routes'
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
  errorMessage,
}) => {
  const location = useLocation()
  const dispatch = useDispatch()
  const searchQueryIncidents = useSelector(makeSelectSearchQuery)
  const { listenFor, unlisten } = useEventEmitter()

  const [modalFilterIsOpen, toggleFilterModal] = useState(false)
  const [modalMyFiltersIsOpen, toggleMyFiltersModal] = useState(false)

  const { count, loadingIncidents, results } = incidents
  const showsMap = location.pathname.split('/').pop() === MAP_URL
  const hasActiveOrdering =
    ordering && ordering !== '-created_at' && ordering !== 'created_at'

  const totalPages = useMemo(() => Math.ceil(count / FILTER_PAGE_SIZE), [count])

  const canRenderList = results && results.length > 0 && totalPages > 0

  /* istanbul ignore next */
  const hasActiveFilters = activeFilter.options
    ? Boolean(
        Object.keys(activeFilter.options).find(
          (key) => activeFilter.options[key].length > 0
        )
      )
    : false

  const disableFilters = hasActiveOrdering || searchQueryIncidents
  const disableSorting = hasActiveFilters || searchQueryIncidents

  useEffect(() => {
    if (errorMessage) {
      dispatch(
        showGlobalNotification({
          title: 'Let op, het sorteren is niet gelukt',
          message: errorMessage,
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [errorMessage, dispatch])

  const showNotification = useCallback(() => {
    dispatch(
      showGlobalNotification({
        variant: VARIANT_NOTICE,
        title:
          'Verwijder eerst uw zoekopdracht om de filteropties te gebruiken',
        message: 'Daarna kunt u de filteropties gebruiken',
        type: TYPE_GLOBAL,
      })
    )
  }, [dispatch])

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

  useEffect(() => {
    listenFor('keydown', escFunction)
    listenFor('openFilter', openFilterModal)

    return () => {
      unlisten('keydown', escFunction)
      unlisten('openFilter', openFilterModal)
    }
  }, [escFunction, openFilterModal, listenFor, unlisten])

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
        <TitleRow>
          <PageHeader
            orderingChangedAction={orderingChangedAction}
            showsMap={showsMap}
          />
          <ButtonWrapper>
            <StyledButton
              data-testid="my-filters-modal-btn"
              color="primary"
              onClick={disableFilters ? showNotification : openMyFiltersModal}
              $disabled={disableFilters}
            >
              Mijn filters
            </StyledButton>

            <StyledButton
              data-testid="filter-modal-btn"
              color="primary"
              onClick={disableFilters ? showNotification : openFilterModal}
              $disabled={disableFilters}
            >
              Filter
            </StyledButton>
          </ButtonWrapper>
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

        {!disableFilters && (
          <Column span={12}>
            <QuickFilter filters={filters} setFilter={handleSetFilter} />
          </Column>
        )}

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
          {!showsMap && <>{pagination}</>}
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
                ordering={incidents.orderedAs}
                orderingChangedAction={orderingChangedAction}
                incidents={incidents.results}
                incidentsCount={count}
                isLoading={loadingIncidents}
                sortingDisabled={disableSorting}
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
  errorMessage: PropTypes.string,
}

const mapStateToProps = createStructuredSelector({
  activeFilter: makeSelectActiveFilter,
  filters: makeSelectFiltersOnOverview,
  incidents: makeSelectIncidents,
  ordering: makeSelectOrdering,
  page: makeSelectPage,
  errorMessage: makeSelectErrorMessage,
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
