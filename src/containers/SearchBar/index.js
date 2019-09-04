import React from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from '@datapunt/asc-ui';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import { requestIncidents } from 'signals/incident-management/containers/IncidentOverviewPage/actions';
import { setSearchQuery } from 'models/search/actions';
import { makeSelectQuery } from 'models/search/selectors';

const allowedButtonCodes = [
  8, // backspace
  37, // left
  39, // right
  46, // delete
  48, // 0
  49, // 1
  50, // 2
  51, // 3
  52, // 4
  53, // 5
  54, // 6
  55, // 7
  56, // 8
  57, // 9
];

export const SearchBarComponent = ({ className, query, onSetSearchQuery, onRequestIncidents }) => {
  /**
   * Send search form input to actions
   *
   * @param {String} searchInput
   */
  const onSearchSubmit = (searchInput) => {
    /* istanbul ignore else */
    if (searchInput) {
      onSetSearchQuery(searchInput);
      onRequestIncidents({ filter: { id: searchInput } });
    }
  };

  return (
    <SearchBar
      className={className}
      data-testid="searchBar"
      placeholder="Zoek op melding nummer"
      onChange={() => {}} // component requires onChange handler, even though we don't need it
      onSubmit={onSearchSubmit}
      value={query}
      onKeyDown={(event) => {
        const { keyCode } = event;

        /* istanbul ignore else */
        if (!allowedButtonCodes.includes(keyCode)) {
          event.preventDefault();
        }
      }}
    />
  );
};

SearchBarComponent.defaultProps = {
  classname: '',
};

SearchBarComponent.propTypes = {
  className: PropTypes.string,
  onRequestIncidents: PropTypes.func.isRequired,
  onSetSearchQuery: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  query: makeSelectQuery,
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onRequestIncidents: requestIncidents,
      onSetSearchQuery: setSearchQuery,
    },
    dispatch,
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SearchBarComponent);
