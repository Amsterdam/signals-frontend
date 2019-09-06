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

const HeaderWithRouter = compose(withRouter)(SiteHeader);

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
    const { isAuthenticated, permissions, userName } = this.props;

    return (
      <HeaderWithRouter
        isAuthenticated={isAuthenticated}
        onLoginLogoutButtonClick={this.onLoginLogoutButtonClick}
        permissions={permissions}
        userName={userName}
      />
    );
  }
}

SiteHeaderContainer.propTypes = {
  isAuthenticated: PropTypes.bool,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  userName: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated(),
  permissions: makeSelectUserPermissions(),
  userName: makeSelectUserName(),
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
