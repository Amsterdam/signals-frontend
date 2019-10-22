import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import { makeSelectAllFilters } from '../IncidentOverviewPage/selectors';
import { applyFilter, removeFilter } from '../IncidentOverviewPage/actions';

import FilterItem from './components/FilterItem';

import './style.scss';

const sortFilters = allFilters => {
  allFilters.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);

  return allFilters;
};

export const MyFiltersComponent = ({
  allFilters, onApplyFilter, onRemoveFilter, onClose,
}) => (
  <div className="my-filters">
    {allFilters && allFilters.length ? sortFilters(allFilters).map(filter => (
      <FilterItem
        key={filter.id}
        filter={filter}
        onApplyFilter={onApplyFilter}
        onRemoveFilter={onRemoveFilter}
        onClose={onClose}
      />
    )) : (
      <div className="my-filters--empty">
        <p>U heeft geen eigen filter opgeslagen.</p>
        <p>Ga naar &lsquo;Filteren&rsquo; en voer een naam in om een filterinstelling op te slaan.</p>
      </div>
    )}
  </div>
);

MyFiltersComponent.propTypes = {
  allFilters: PropTypes.array.isRequired,
  onApplyFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  allFilters: makeSelectAllFilters,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    onApplyFilter: applyFilter,
    onRemoveFilter: removeFilter,
  },
  dispatch,
);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(MyFiltersComponent);
