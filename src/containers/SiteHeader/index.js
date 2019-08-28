import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectUserName,
  makeSelectUserPermissions,
  makeSelectIsAuthenticated,
} from 'containers/App/selectors';
import SiteHeader from 'components/SiteHeader';
import { withRouter } from 'react-router-dom';

import { doLogin, doLogout } from '../App/actions';

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
    if (!this.props.isAuthenticated) {
      this.props.onLogin(domain);
    } else {
      this.props.onLogout();
    }
  }

  render() {
    return (
      <HeaderWithRouter
        permissions={this.props.permissions}
        isAuthenticated={this.props.isAuthenticated}
        onLoginLogoutButtonClick={this.onLoginLogoutButtonClick}
        userName={this.props.userName}
      />
    );
  }
}

SiteHeaderContainer.propTypes = {
  userName: PropTypes.string,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  userName: makeSelectUserName(),
  permissions: makeSelectUserPermissions(),
  isAuthenticated: makeSelectIsAuthenticated(),
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onLogin: doLogin,
      onLogout: doLogout,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(SiteHeaderContainer);
