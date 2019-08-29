import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectUserName,
  makeSelectUserPermissions,
} from 'containers/App/selectors';
import SiteHeader from 'components/SiteHeader';
import { withRouter } from 'react-router-dom';
import { requestIncidents as onRequestIncidents } from 'signals/incident-management/containers/IncidentOverviewPage/actions';
import { setSearchQuery } from 'models/search/actions';
import { isAuthenticated } from 'shared/services/auth/auth';

import { doLogin, doLogout } from '../App/actions';

const HeaderWithRouter = withRouter(SiteHeader);

export class SiteHeaderContainer extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onLoginLogoutButtonClick = this.onLoginLogoutButtonClick.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  onLoginLogoutButtonClick(event, domain) {
    event.persist();
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated()) {
      this.props.onLogin(domain);
    } else {
      this.props.onLogout();
    }
  }

  /**
   * Send search form input to action
   *
   * @param {String} searchInput
   */
  onSearchSubmit = (searchInput) => {
    if (!searchInput) return;

    this.props.onSetSearchQuery(searchInput);
    this.props.onRequestIncidents({ filter: { id: searchInput } });
  }

  render() {
    return (
      <HeaderWithRouter
        permissions={this.props.permissions}
        isAuthenticated={isAuthenticated()}
        onLoginLogoutButtonClick={this.onLoginLogoutButtonClick}
        userName={this.props.userName}
        onSearchSubmit={this.onSearchSubmit}
      />
    );
  }
}

SiteHeaderContainer.propTypes = {
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onRequestIncidents: PropTypes.func,
  onSetSearchQuery: PropTypes.func,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  userName: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  permissions: makeSelectUserPermissions(),
  userName: makeSelectUserName(),
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onLogin: doLogin,
      onLogout: doLogout,
      onRequestIncidents,
      onSetSearchQuery: setSearchQuery,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(SiteHeaderContainer);
