import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import { makeSelectAllFilters, makeSelectRemovedFilter } from '../IncidentOverviewPage/selectors';
import { applyFilter, removeFilter, revertFilter, requestIncidents } from '../IncidentOverviewPage/actions';
import { resetSearchQuery } from '../../../../models/search/actions';

import FilterItem from './components/FilterItem';

import './style.scss';

const sortFilters = (allFilters) => {
  allFilters.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);

  return allFilters;
};

export const MyFilters = ({ allFilters, removedFilter, onApplyFilter, onRemoveFilter, onRevertFilter, onClose, onRequestIncidents, onResetSearchQuery }) => (
  <div className="my-filters">
    {removedFilter && removedFilter.name ? <div className="my-filters__removed-filter">
      De filterinstelling &ldquo;{removedFilter.name}&rdquo; is verwijderd.
      <div><button className="my-filters__revert-button" type="button" onClick={() => onRevertFilter(removedFilter)}>Ongedaan maken</button></div>
    </div> : ''}

    {allFilters && allFilters.length && sortFilters(allFilters).map((filter) => (
      <FilterItem
        key={filter._links.self.href}
        filter={filter}
        onApplyFilter={onApplyFilter}
        onRemoveFilter={onRemoveFilter}
        onClose={onClose}
        onRequestIncidents={onRequestIncidents}
        onResetSearchQuery={onResetSearchQuery}
      />
    ))}
  </div>
);

MyFilters.propTypes = {
  allFilters: PropTypes.array.isRequired,
  removedFilter: PropTypes.object,
  onApplyFilter: PropTypes.func.isRequired,
  onRevertFilter: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  onResetSearchQuery: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  allFilters: makeSelectAllFilters,
  removedFilter: makeSelectRemovedFilter,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onApplyFilter: applyFilter,
      onRemoveFilter: removeFilter,
      onRevertFilter: revertFilter,
      onRequestIncidents: requestIncidents,
      onResetSearchQuery: resetSearchQuery,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(MyFilters);
