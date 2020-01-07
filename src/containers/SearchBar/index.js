import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from '@datapunt/asc-ui';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
// import { useHistory } from 'react-router';

import {
  // applyFilter,
  // requestIncidents,
  // resetSearchIncidents,
  // searchIncidents,
  setSearchQuery,
  resetSearchQuery,
} from 'signals/incident-management/actions';
import { makeSelectSearchQuery } from 'signals/incident-management/selectors';

export const SearchBarComponent = ({
  className,
  query,
  // onApplyFilter,
  // onSearchIncidents,
  // onResetSearchIncidents,
  // onRequestIncidents,
  setSearchQueryAction,
  resetSearchQueryAction,
}) => {
  // const history = useHistory();

  /**
   * Send search form input to actions
   *
   * @param {String} searchInput
   */
  const onSearchSubmit = useCallback(
    searchInput => {
      // onApplyFilter({});
      // history.push('/manage/incidents');
      setSearchQueryAction(searchInput);
    },
    [setSearchQueryAction]
  );

  const onChange = useCallback(
    value => {
      if (value === '') {
        resetSearchQueryAction();
        // onRequestIncidents();
      }
    },
    [resetSearchQueryAction]
  );

  return (
    <SearchBar
      className={className}
      data-testid="searchBar"
      placeholder="Zoek op meldingsnummer"
      onChange={onChange}
      onSubmit={onSearchSubmit}
      value={query}
    />
  );
};

SearchBarComponent.defaultProps = {
  className: '',
};

SearchBarComponent.propTypes = {
  className: PropTypes.string,
  // onApplyFilter: PropTypes.func.isRequired,
  // onResetSearchIncidents: PropTypes.func.isRequired,
  setSearchQueryAction: PropTypes.func.isRequired,
  resetSearchQueryAction: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  query: makeSelectSearchQuery,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // onApplyFilter: applyFilter,
      // onRequestIncidents: requestIncidents,
      // onSearchIncidents: searchIncidents,
      // onResetSearchIncidents: resetSearchIncidents,
      setSearchQueryAction: setSearchQuery,
      resetSearchQueryAction: resetSearchQuery,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SearchBarComponent);
