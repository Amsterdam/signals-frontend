import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Route } from 'react-router-dom';

import LoginPage from 'components/LoginPage';
import { makeSelectIsAuthenticated } from 'containers/App/selectors';

import IncidentOverviewPage from '../../containers/IncidentOverviewPage';
import IncidentDetailPage from '../../containers/IncidentDetailPage';

import './style.scss';


export class IncidentManagementModule extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { isAuthenticated } = this.props;
    const baseUrl = this.props.match.url;
    const IncidentDetailPageWrapper = (props) => (<IncidentDetailPage id={props.match.params.id} baseUrl={baseUrl} />);
    const IncidentOverviewPageWrapper = () => (<IncidentOverviewPage baseUrl={baseUrl} />);

    return (
      <div className="manage-incident">
        {
          !isAuthenticated ? (
            <Route component={LoginPage} />
          ) : (
            <div className="row">
              <div className="col-12">
                <Route exact path={`${baseUrl}/incidents`} render={IncidentOverviewPageWrapper} />
                <Route exact path={`${baseUrl}/incident/:id`} render={IncidentDetailPageWrapper} />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

IncidentManagementModule.propTypes = {
  match: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated()
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
)(IncidentManagementModule);
