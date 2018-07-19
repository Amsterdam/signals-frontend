/**
 *
 * HeaderContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectUserName } from 'containers/App/selectors';
import Header from 'components/Header';

import { doLogin, doLogout } from '../App/actions';

import './style.scss';

import { isAuthenticated } from '../../shared/services/auth/auth';

export class HeaderContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
      <Header
        isAuthenticated={isAuthenticated()}
        onLoginLogoutButtonClick={this.onLoginLogoutButtonClick}
        userName={this.props.userName}
      />
    );
  }
}

HeaderContainer.propTypes = {
  userName: PropTypes.string,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  userName: makeSelectUserName()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onLogin: doLogin,
  onLogout: doLogout
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(HeaderContainer);
