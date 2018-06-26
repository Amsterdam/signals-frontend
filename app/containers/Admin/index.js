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
import makeSelectAdmin from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import AdminComponent from '../../meldingen/admin/AdminComponent';
import { isAuthenticated } from '../../shared/services/auth/auth';

export class Admin extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="admin">
        <AdminComponent
          match={this.props.match}
          isAuthenticated={isAuthenticated()}
        />
      </div>
    );
  }
}

Admin.propTypes = {
  dispatch: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  match: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
  admin: makeSelectAdmin(),
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
