/**
 *
 * Admin
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectAccessToken, makeSelectUserName } from 'containers/App/selectors';
import makeSelectAdmin from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import AdminComponent from '../../meldingen/admin/AdminComponent';

export class Admin extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="admin">
        <AdminComponent
          match={this.props.match}
          isAuthenticated={Boolean(this.props.userAccessToken)}
          userName={this.props.userName}
        />
      </div>
    );
  }
}

Admin.propTypes = {
  dispatch: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  match: PropTypes.object,
  userAccessToken: PropTypes.string,
  userName: PropTypes.string
};

const mapStateToProps = createStructuredSelector({
  admin: makeSelectAdmin(),
  userAccessToken: makeSelectAccessToken(),
  userName: makeSelectUserName()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'admin', reducer });
const withSaga = injectSaga({ key: 'admin', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Admin);
