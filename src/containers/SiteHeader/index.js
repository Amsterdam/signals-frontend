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

import { doLogin, doLogout } from '../App/actions';
import { isAuthenticated } from '../../shared/services/auth/auth';
import { emptyReverted } from '../../signals/incident-management/containers/IncidentOverviewPage/actions';

const HeaderWithRouter = withRouter(SiteHeader);

export class SiteHeaderContainer extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onLoginLogoutButtonClick = this.onLoginLogoutButtonClick.bind(this);
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

  render() {
    return (
      <HeaderWithRouter
        permissions={this.props.permissions}
        isAuthenticated={isAuthenticated()}
        onLoginLogoutButtonClick={this.onLoginLogoutButtonClick}
        onClose={this.props.onClose}
        userName={this.props.userName}
      />
    );
  }
}

SiteHeaderContainer.propTypes = {
  userName: PropTypes.string,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = createStructuredSelector({
  userName: makeSelectUserName(),
  permissions: makeSelectUserPermissions(),
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onLogin: doLogin,
      onLogout: doLogout,
      onClose: emptyReverted,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(SiteHeaderContainer);
