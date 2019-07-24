import React, { Fragment } from 'react';
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

export const IncidentManagementModuleComponent = ({
  isAuthenticated,
  match: { url },
}) =>
  !isAuthenticated ? (
    <Route component={LoginPage} />
  ) : (
    <Fragment>
      <Route
        exact
        path={`${url}/incidents`}
        render={() => <IncidentOverviewPage baseUrl={url} />}
      />
      <Route
        exact
        path={`${url}/incident/:id`}
        render={(wrapperProps) => (
          <IncidentDetail id={wrapperProps.match.params.id} baseUrl={url} />
        )}
      />
      <Route
        exact
        path={`${url}/incident/:id/split`}
        render={(wrapperProps) => (
          <IncidentSplitContainer
            id={wrapperProps.match.params.id}
            baseUrl={url}
          />
        )}
      />
      <Route path={`${url}/standaard/teksten`} component={DefaultTextsAdmin} />
      <Route path={`${url}/dashboard`} component={DashboardContainer} />
    </Fragment>
  );

IncidentManagementModuleComponent.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(IncidentManagementModuleComponent);
