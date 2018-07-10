/**
 *
 * LoginPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLoginPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import { login } from '../../../../shared/services/auth/auth';


export class LoginPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  onLogin() {
    login();
  }

  render() {
    return (
      <div className="login-page notification notification-red margin-top-bottom">
        <div className="col-12">
          <p>
            Om deze pagina te zien dient u ingelogd te zijn.
          </p>
          <button className="action primary" onClick={this.onLogin}>
            <span className="value">Inloggen</span>
          </button>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loginpage: makeSelectLoginPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'loginPage', reducer });
const withSaga = injectSaga({ key: 'loginPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LoginPage);
