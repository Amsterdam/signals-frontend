// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { compose, bindActionCreators } from 'redux'

import { makeSelectEditFilter } from 'signals/incident-management/selectors'
import FilterForm from 'signals/incident-management/components/FilterForm'
import { filterType } from 'shared/types'

import {
  applyFilter,
  clearEditFilter as onClearFilter,
  filterEditCanceled,
  filterSaved as onSaveFilter,
  filterUpdated as onUpdateFilter,
} from 'signals/incident-management/actions'

export const FilterContainerComponent = ({
  onApplyFilter,
  onCancel,
  onFilterEditCancel,
  onSubmit,
  filter,
  ...rest
}) => {
  const editFilter = useMemo(() => filter, [filter])

  const onFormSubmit = useCallback(
    (event, filterData) => {
      onApplyFilter(filterData)
      onSubmit(event)
    },
    [onApplyFilter, onSubmit]
  )

  const onEditCancel = useCallback(() => {
    onFilterEditCancel()
    onCancel()
  }, [onFilterEditCancel, onCancel])

  return (
    <FilterForm
      {...rest}
      filter={editFilter}
      onCancel={onEditCancel}
      onSubmit={onFormSubmit}
    />
  )
}

FilterContainerComponent.propTypes = {
  filter: filterType.isRequired,
  onApplyFilter: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onFilterEditCancel: PropTypes.func.isRequired,
  onSaveFilter: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUpdateFilter: PropTypes.func.isRequired,
}

const mapStateToProps = () =>
  createStructuredSelector({
    filter: makeSelectEditFilter,
  })

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onApplyFilter: applyFilter,
      onClearFilter,
      onFilterEditCancel: filterEditCanceled,
      onSaveFilter,
      onUpdateFilter,
    },
    dispatch
  )

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(FilterContainerComponent)
