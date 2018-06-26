/**
 *
 * HeaderContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectUserName } from 'containers/App/selectors';
import Header from 'components/Header';

import './style.scss';

import { login, logout, isAuthenticated } from '../../shared/services/auth/auth';

export class HeaderContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static onLoginLogoutButtonClick(event) {
    event.persist();
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated()) {
      login();
    } else {
      logout();
    }
  }

  render() {
    return (
      <Header
        isAuthenticated={isAuthenticated()}
        onLoginLogoutButtonClick={HeaderContainer.onLoginLogoutButtonClick}
        userName={this.props.userName}
      />
    );
  }
}

HeaderContainer.propTypes = {
  dispatch: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  userName: PropTypes.string
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}


const mapStateToProps = createStructuredSelector({
  userName: makeSelectUserName()
});


const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(HeaderContainer);
