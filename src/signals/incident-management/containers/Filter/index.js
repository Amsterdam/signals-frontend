import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import { makeSelectStructuredCategories } from 'models/categories/selectors';
import {
  makeSelectEditFilter,
  makeSelectDataLists,
} from 'signals/incident-management/selectors';
import FilterForm from 'signals/incident-management/components/FilterForm';
import * as types from 'shared/types';

import {
  applyFilter,
  clearEditFilter as onClearFilter,
  filterEditCanceled,
  filterSaved as onSaveFilter,
  filterUpdated as onUpdateFilter,
} from 'signals/incident-management/actions';

export const FilterContainerComponent = ({
  categories,
  dataLists,
  onApplyFilter,
  onCancel,
  onFilterEditCancel,
  onSubmit,
  ...rest
}) => {
  const onFormSubmit = useCallback(
    (event, filter) => {
      onApplyFilter(filter);
      onSubmit(event);
    },
    [onApplyFilter, onSubmit]
  );

  const onEditCancel = useCallback(() => {
    onFilterEditCancel();
    onCancel();
  }, [onFilterEditCancel, onCancel]);

  return (
    <FilterForm
      {...rest}
      onCancel={onEditCancel}
      categories={categories}
      dataLists={dataLists}
      onSubmit={onFormSubmit}
    />
  );
};

FilterContainerComponent.propTypes = {
  categories: types.categoriesType.isRequired,
  dataLists: types.dataListsType.isRequired,
  filter: types.filterType.isRequired,
  onApplyFilter: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onFilterEditCancel: PropTypes.func.isRequired,
  onSaveFilter: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUpdateFilter: PropTypes.func.isRequired,
};

const mapStateToProps = () =>
  createStructuredSelector({
    categories: makeSelectStructuredCategories,
    dataLists: makeSelectDataLists,
    filter: makeSelectEditFilter,
  });

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onApplyFilter: applyFilter,
      onClearFilter,
      onFilterEditCancel: filterEditCanceled,
      onSaveFilter,
      onUpdateFilter,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(FilterContainerComponent);
