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
  makeSelectFilter,
  makeSelectDataLists,
} from 'signals/incident-management/selectors';
import FilterForm from 'signals/incident-management/components/FilterForm';
import * as types from 'shared/types';

import {
  applyFilter,
  filterSaved as onSaveFilter,
  filterUpdated as onUpdateFilter,
  filterCleared as onClearFilter,
} from 'signals/incident-management/actions';

export const FilterContainerComponent = ({
  onApplyFilter,
  onRequestIncidents,
  onSubmit,
  dataLists,
  categories,
  ...rest
}) => {
  const onFormSubmit = (event, filter) => {
    onApplyFilter(filter);
    onRequestIncidents({ filter });
    onSubmit(event);
  };

  return (
    <FilterForm
      {...rest}
      categories={categories}
      dataLists={dataLists}
      onSubmit={onFormSubmit}
    />
  );
};

FilterContainerComponent.propTypes = {
  activeFilter: types.filter.isRequired,
  categories: types.categories.isRequired,
  dataLists: types.dataLists.isRequired,
  onApplyFilter: PropTypes.func.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  onSaveFilter: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUpdateFilter: PropTypes.func.isRequired,
};

const mapStateToProps = () =>
  createStructuredSelector({
    dataLists: makeSelectDataLists(),
    categories: makeSelectCategories(),
    activeFilter: makeSelectFilter(),
  });

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onApplyFilter: applyFilter,
      onClearFilter,
      onIncidentSelected,
      onRequestIncidents: requestIncidents,
      onSaveFilter,
      onUpdateFilter,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(FilterContainerComponent);
