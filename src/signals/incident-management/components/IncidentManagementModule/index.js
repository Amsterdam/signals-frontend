import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Route } from 'react-router-dom';

import LoginPage from 'components/LoginPage';
import { makeSelectIsAuthenticated } from 'containers/App/selectors';

import IncidentOverviewPage from '../../containers/IncidentOverviewPage';
import IncidentDetail from '../../containers/IncidentDetail';
import DashboardContainer from '../../containers/DashboardContainer';
import DefaultTextsAdmin from '../../containers/DefaultTextsAdmin';
import IncidentSplitContainer from '../../containers/IncidentSplitContainer';

import './style.scss';


export class IncidentManagementModule extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { isAuthenticated } = this.props;
    const baseUrl = this.props.match.url;
    const IncidentDetailWrapper = (props) => (<IncidentDetail id={props.match.params.id} baseUrl={baseUrl} />);
    const IncidentOverviewPageWrapper = () => (<IncidentOverviewPage baseUrl={baseUrl} />);
    const IncidentSplitContainerWrapper = (props) => (<IncidentSplitContainer id={props.match.params.id} baseUrl={baseUrl} />);

    return (
      <div className="manage-incident">
        {
          !isAuthenticated ? (
            <Route component={LoginPage} />
          ) : (
            <div>
              <Route exact path={`${baseUrl}/incidents`} render={IncidentOverviewPageWrapper} />
              <Route exact path={`${baseUrl}/incident/:id`} render={IncidentDetailWrapper} />
              <Route exact path={`${baseUrl}/incident/:id/split`} render={IncidentSplitContainerWrapper} />
              <Route path={`${baseUrl}/default/texts`} component={DefaultTextsAdmin} />
              <Route path={`${baseUrl}/dashboard`} component={DashboardContainer} />
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
