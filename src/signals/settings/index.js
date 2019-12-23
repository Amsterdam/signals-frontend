import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { isAuthenticated } from 'shared/services/auth/auth';

import LoginPage from 'components/LoginPage';
import {
  makeSelectUserCanAccess,
  makeSelectUserCan,
} from 'containers/App/selectors';

import routes, { USERS_PAGED_URL, USER_URL, ROLE_URL } from './routes';
import UsersOverviewContainer from './users/containers/Overview';
import RolesListContainer from './roles/containers/RolesListContainer';
import RoleFormContainer from './roles/containers/RoleFormContainer';
import UsersDetailContainer from './users/containers/Detail';

export const SettingsModule = ({ userCan, userCanAccess }) => {
  const moduleLocation = useLocation();
  const [location, setLocation] = useState(moduleLocation);

  // subscribe to updates and set the referrer when page URLs differ
  useEffect(() => {
    if (location.pathname !== moduleLocation.pathname) {
      const locWithReferrer = {
        ...moduleLocation,
        referrer: location.pathname,
      };

      setLocation(locWithReferrer);
    }
  }, [location.pathname, moduleLocation, setLocation]);

  if (!isAuthenticated()) {
    return <Route component={LoginPage} />;
  }

  return (
    <Switch location={location}>
      {userCanAccess('settings') === false && (
        <Redirect to="/manage/incidents" />
      )}

      {/*
       * always redirect from /gebruikers to /gebruikers/page/1 to avoid having complexity
       * in the UsersOverviewContainer component
       */}
      <Redirect exact from={routes.users} to={`${USERS_PAGED_URL}/1`} />

      {userCanAccess('users') && (
        <Fragment>
          <Route
            exact
            path={routes.usersPaged}
            component={UsersOverviewContainer}
          />
          {(userCan('view_user') || userCan('change_user')) && (
            <Route exact path={routes.user} component={UsersDetailContainer} />
          )}
          {userCan('add_user') && (
            <Route exact path={USER_URL} component={UsersDetailContainer} />
          )}
        </Fragment>
      )}

      {userCanAccess('groups') && (
        <Route exact path={routes.roles} component={RolesListContainer} />
      )}

      {userCanAccess('groups') && (
        <Fragment>

          {(userCan('view_group') || userCan('change_group')) && (
            <Route exact path={routes.role} component={RoleFormContainer} />
          )}
          {userCan('add_group') && (
            <Route exact path={ROLE_URL} component={RoleFormContainer} />
          )}
        </Fragment>
      )}
    </Switch>
  );
};

SettingsModule.propTypes = {
  userCan: PropTypes.func.isRequired,
  userCanAccess: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userCan: makeSelectUserCan,
  userCanAccess: makeSelectUserCanAccess,
});
const withConnect = connect(mapStateToProps);

export default compose(withConnect)(SettingsModule);
