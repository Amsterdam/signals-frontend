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
  constructor(props) {
    super(props);
    this.onLoginLogoutButtonClick = this.onLoginLogoutButtonClick.bind(this);
  }

  onLoginLogoutButtonClick(event) {
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
        onLoginLogoutButtonClick={this.onLoginLogoutButtonClick}
        userName={this.props.userName}
      />
    );
  }
}

HeaderContainer.propTypes = {
  userName: PropTypes.string
};

const mapStateToProps = createStructuredSelector({
  userName: makeSelectUserName()
});


const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
)(HeaderContainer);
