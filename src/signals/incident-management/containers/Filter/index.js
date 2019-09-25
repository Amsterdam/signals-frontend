import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import {
  makeSelectCategories,
  makeSelectDataLists,
} from 'containers/App/selectors';
import {
  requestIncidents,
  incidentSelected as onIncidentSelected,
} from 'signals/incident-management/containers/IncidentOverviewPage/actions';
import { makeSelectFilter } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';
import FilterForm from 'signals/incident-management/components/FilterForm';
import { resetSearchQuery } from 'models/search/actions';
import * as types from 'shared/types';

import saga from './saga';
import reducer from './reducer';
import {
  filterSaved as onSaveFilter,
  filterUpdated as onUpdateFilter,
  filterCleared as onClearFilter,
} from './actions';

export const FilterContainerComponent = ({
  onResetSearchQuery,
  onRequestIncidents,
  onSubmit,
  ...rest
}) => {
  const onFormSubmit = (event, formData) => {
    onResetSearchQuery();
    onRequestIncidents({ filter: formData });
    onSubmit(event);
  };

  return <FilterForm {...rest} onSubmit={onFormSubmit} />;
};

FilterContainerComponent.propTypes = {
  activeFilter: types.parsedFilterType,
  categories: types.categories.isRequired,
  dataLists: types.dataLists.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  onResetSearchQuery: PropTypes.func.isRequired,
  onSaveFilter: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUpdateFilter: PropTypes.func.isRequired,
};

const mapStateToProps = () =>
  createStructuredSelector({
    dataLists: makeSelectDataLists(),
    categories: makeSelectCategories(),
    activeFilter: makeSelectFilter,
  });

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onClearFilter,
      onIncidentSelected,
      onRequestIncidents: requestIncidents,
      onResetSearchQuery: resetSearchQuery,
      onSaveFilter,
      onUpdateFilter,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'incidentManagementFilter', reducer });
const withSaga = injectSaga({ key: 'incidentManagementFilter', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(FilterContainerComponent);
