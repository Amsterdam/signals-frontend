import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import { makeSelectCategories } from 'containers/App/selectors';
import {
  requestIncidents,
  incidentSelected as onIncidentSelected,
} from 'signals/incident-management/containers/IncidentOverviewPage/actions';
import {
  makeSelectEditFilter,
  makeSelectDataLists,
} from 'signals/incident-management/selectors';
import FilterForm from 'signals/incident-management/components/FilterForm';
import * as types from 'shared/types';

import {
  applyFilter,
  editFilter,
  filterEditCanceled,
  filterSaved as onSaveFilter,
  filterUpdated as onUpdateFilter,
  filterCleared as onClearFilter,
} from 'signals/incident-management/actions';

export const FilterContainerComponent = ({
  categories,
  dataLists,
  onApplyFilter,
  onCancel,
  onEditFilter,
  onFilterEditCancel,
  onSubmit,
  onRequestIncidents,
  ...rest
}) => {
  /**
   * When submitting the filter form:
   * - the active filter has to be set so that incidents can be retrieved with those settings
   * - the edit filter has to be set to populate the filter form when the form is opened again
   * - incidents have to be requested
   * - the parent's submit() callback handler has to be called
   */
  const onFormSubmit = (event, filter) => {
    onApplyFilter(filter);
    onEditFilter(filter);
    onRequestIncidents();
    onSubmit(event);
  };

  const onEditCancel = () => {
    onFilterEditCancel();
    onCancel();
  };

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
  onEditFilter: PropTypes.func.isRequired,
  onFilterEditCancel: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  onSaveFilter: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUpdateFilter: PropTypes.func.isRequired,
};

const mapStateToProps = () =>
  createStructuredSelector({
    categories: makeSelectCategories(),
    dataLists: makeSelectDataLists,
    filter: makeSelectEditFilter,
  });

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onApplyFilter: applyFilter,
      onClearFilter,
      onEditFilter: editFilter,
      onFilterEditCancel: filterEditCanceled,
      onIncidentSelected,
      onRequestIncidents: requestIncidents,
      onSaveFilter,
      onUpdateFilter,
    },
    dispatch
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(FilterContainerComponent);
