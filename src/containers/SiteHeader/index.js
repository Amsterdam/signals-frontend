import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectUserPermissions,
  makeSelectNotification,
} from 'containers/App/selectors';
import SiteHeader from 'components/SiteHeader';
import { useHistory } from 'react-router-dom';
import { isAuthenticated } from 'shared/services/auth/auth';

import { doLogin, doLogout, resetGlobalNotification } from '../App/actions';

const SiteHeaderContainer = ({
  onLogin,
  onLogout,
  notification,
  onResetNotification,
  permissions,
}) => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      onResetNotification();
    });

    return () => {
      unlisten();
    };
  }, []);

  const onSignOut = useCallback(
    (event, domain) => {
      event.persist();
      event.preventDefault();
      event.stopPropagation();

      if (!isAuthenticated()) {
        onLogin(domain);
      } else {
        onLogout();
      }
    },
    [onLogin, onLogout]
  );

  return (
    <SiteHeader
      isAuthenticated={isAuthenticated()}
      notification={notification}
      onSignOut={onSignOut}
      onResetNotification={onResetNotification}
      permissions={permissions}
    />
  );
};

SiteHeaderContainer.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
  }),
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onResetNotification: PropTypes.func,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = createStructuredSelector({
  notification: makeSelectNotification(),
  permissions: makeSelectUserPermissions(),
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onLogin: doLogin,
      onLogout: doLogout,
      onResetNotification: resetGlobalNotification,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SiteHeaderContainer);
