import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import {
  applyFilter,
  editFilter,
  removeFilter,
} from 'signals/incident-management/actions';
import { makeSelectAllFilters } from 'signals/incident-management/selectors';
import * as types from 'shared/types';

import FilterItem from './components/FilterItem';

import './style.scss';

const sortFilters = filters => {
  filters.sort((a, b) =>
    a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  );

  return filters;
};

export const MyFiltersComponent = ({
  filters,
  onApplyFilter,
  onEditFilter,
  onRemoveFilter,
  onClose,
}) => {
  /**
   * Selecting apply filter should show the filtered incidents as well as set the filter values
   * for the filter form and should thus call both the onApplyFilter and onEditFilter actions
   */
  const handleApplyFilter = useCallback(filter => {
    onApplyFilter(filter);
  }, [onApplyFilter]);

  const handleEditFilter = useCallback(filter => {
    onEditFilter(filter);
    // IE11 doesn't support dispatching an event without initialisation
    // @see {@link https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Creating_custom_events}
    let event;
    if (typeof Event === 'function') {
      event = new Event('openFilter');
    } else {
      event = document.createEvent('Event');
      const bubbles = false;
      const cancelable = false;
      event.initEvent('openFilter', bubbles, cancelable);
    }

    event.data = filter;
    document.dispatchEvent(event);
  }, [onEditFilter]);

  return (
    <div className="my-filters">
      {filters && filters.length ? (
        sortFilters(filters).map(filter => (
          <FilterItem
            key={filter.id}
            filter={filter}
            onEditFilter={handleEditFilter}
            onApplyFilter={handleApplyFilter}
            onRemoveFilter={onRemoveFilter}
            onClose={onClose}
          />
        ))
      ) : (
        <div className="my-filters--empty">
          <p>U heeft geen eigen filter opgeslagen.</p>
          <p>
            Ga naar &lsquo;Filteren&rsquo; en voer een naam in om een
            filterinstelling op te slaan.
          </p>
        </div>
      )}
    </div>
  );
};

MyFiltersComponent.propTypes = {
  filters: PropTypes.arrayOf(types.filterType),
  onApplyFilter: PropTypes.func.isRequired,
  onEditFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  filters: makeSelectAllFilters,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onApplyFilter: applyFilter,
      onEditFilter: editFilter,
      onRemoveFilter: removeFilter,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(MyFiltersComponent);
