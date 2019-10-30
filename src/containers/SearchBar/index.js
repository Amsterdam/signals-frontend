import React from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from '@datapunt/asc-ui';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router';

import { requestIncidents } from 'signals/incident-management/containers/IncidentOverviewPage/actions';
import { setSearchQuery } from 'models/search/actions';
import { makeSelectQuery } from 'models/search/selectors';
import { applyFilter } from 'signals/incident-management/actions';

export const SearchBarComponent = ({
  className,
  query,
  onApplyFilter,
  onSetSearchQuery,
  onRequestIncidents,
  history,
}) => {
  /**
   * Send search form input to actions
   *
   * @param {String} searchInput
   */
  const onSearchSubmit = searchInput => {
    onApplyFilter({});
    onSetSearchQuery(searchInput);
    history.push('/manage/incidents');
    onRequestIncidents();
  };

  const onChange = value => {
    if (value === '') {
      onSetSearchQuery('');
      onRequestIncidents();
    }
  };

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
  onRequestIncidents: PropTypes.func.isRequired,
  onSetSearchQuery: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = createStructuredSelector({
  query: makeSelectQuery,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onApplyFilter: applyFilter,
      onRequestIncidents: requestIncidents,
      onSetSearchQuery: setSearchQuery,
    },
    dispatch
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default withRouter(compose(withConnect)(SearchBarComponent));
