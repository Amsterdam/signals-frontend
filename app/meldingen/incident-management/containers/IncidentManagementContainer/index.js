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
import { Route } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { isAuthenticated } from 'shared/services/auth/auth';

import makeSelectAdmin from './selectors';
import reducer from './reducer';
import saga from './saga';

import OverviewPage from '../OverviewPage';
import IncidentDetailPage from '../IncidentDetailPage';
import LoginPage from '../LoginPage';

import './style.scss';


export class IncidentManagementContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const baseUrl = this.props.match.url;
    const IncidentDetailPageWrapper = (props) => (<IncidentDetailPage id={props.match.params.id} baseUrl={baseUrl} />);
    const OverviewPageWrapper = () => (<OverviewPage baseUrl={baseUrl} />);
    const LoginPageWrapper = () => (<LoginPage baseUrl={baseUrl} />);

    return (
      <div className="incident-management-router">
        {
          !isAuthenticated() ? (
            <Route render={LoginPageWrapper} />
          ) : (
            <div className="row">
              <div className="col-12">
                <Route exact path={`${baseUrl}/incidents`} render={OverviewPageWrapper} />
                <Route exact path={`${baseUrl}/incident/:id`} render={IncidentDetailPageWrapper} />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

IncidentManagementContainer.propTypes = {
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
)(IncidentManagementContainer);
