// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'

import {
  applyFilter,
  editFilter,
  removeFilter,
  filterUpdated,
} from 'signals/incident-management/actions'
import { makeSelectAllFilters } from 'signals/incident-management/selectors'
import * as types from 'shared/types'
import useEventEmitter from 'hooks/useEventEmitter'

import FilterItem from './components/FilterItem'

const sortFilters = (filters) => {
  filters.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))

  return filters
}

const MyFilters = styled.div`
  width: 100%;
`

const NoFilters = styled.div`
  color: ${themeColor('tint', 'level4')};
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: ${themeSpacing(20)};
  text-align: center;
`

export const MyFiltersComponent = ({
  filters,
  onApplyFilter,
  onEditFilter,
  onRemoveFilter,
  onUpdateFilter,
  onClose,
}) => {
  const { emit } = useEventEmitter()
  /**
   * Selecting apply filter should show the filtered incidents as well as set the filter values
   * for the filter form and should thus call both the onApplyFilter and onEditFilter actions
   */
  const handleApplyFilter = useCallback(
    (filter) => {
      onApplyFilter(filter)
    },
    [onApplyFilter]
  )

  const handleEditFilter = useCallback(
    (filter) => {
      onEditFilter(filter)

      emit('openFilter')
    },
    [onEditFilter, emit]
  )

  return (
    <MyFilters className="my-filters">
      {filters && filters.length ? (
        sortFilters(filters).map((filter) => (
          <FilterItem
            key={filter.id}
            filter={filter}
            onEditFilter={handleEditFilter}
            onApplyFilter={handleApplyFilter}
            onRemoveFilter={onRemoveFilter}
            onUpdateFilter={onUpdateFilter}
            onClose={onClose}
          />
        ))
      ) : (
        <NoFilters className="my-filters--empty">
          <p>U heeft geen eigen filter opgeslagen.</p>
          <p>
            Ga naar &lsquo;Filter&rsquo; en voer een naam in om een
            filterinstelling op te slaan.
          </p>
        </NoFilters>
      )}
    </MyFilters>
  )
}

MyFiltersComponent.propTypes = {
  filters: PropTypes.arrayOf(types.filterType),
  onApplyFilter: PropTypes.func.isRequired,
  onEditFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
}

const mapStateToProps = createStructuredSelector({
  filters: makeSelectAllFilters,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onApplyFilter: applyFilter,
      onEditFilter: editFilter,
      onRemoveFilter: removeFilter,
      onUpdateFilter: filterUpdated,
    },
    dispatch
  )

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default withConnect(MyFiltersComponent)
