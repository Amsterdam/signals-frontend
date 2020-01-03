import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from '@datapunt/asc-ui';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router';

import { requestIncidents, searchIncidents, resetSearchIncidents } from 'signals/incident-management/containers/IncidentOverviewPage/actions';
import { makeSelectSearchQuery } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';
import { applyFilter } from 'signals/incident-management/actions';

export const SearchBarComponent = ({
  className,
  query,
  onApplyFilter,
  onSearchIncidents,
  onResetSearchIncidents,
  onRequestIncidents,
  history,
}) => {
  /**
   * Send search form input to actions
   *
   * @param {String} searchInput
   */
  const onSearchSubmit = useCallback(searchInput => {
    onApplyFilter({});
    history.push('/manage/incidents');
    onSearchIncidents(searchInput);
  }, [history, onApplyFilter, onSearchIncidents]);

  const onChange = useCallback(value => {
    if (value === '') {
      onResetSearchIncidents();
      onRequestIncidents();
    }
  }, [onSearchIncidents, onRequestIncidents]);

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
  onApplyFilter: PropTypes.func.isRequired,
  onResetSearchIncidents: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  onSearchIncidents: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = createStructuredSelector({
  query: makeSelectSearchQuery,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onApplyFilter: applyFilter,
      onRequestIncidents: requestIncidents,
      onSearchIncidents: searchIncidents,
      onResetSearchIncidents: resetSearchIncidents,
    },
    dispatch
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default withRouter(compose(withConnect)(SearchBarComponent));
