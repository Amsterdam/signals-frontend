import React, { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import type { RouteProps } from 'react-router-dom';
import { Route } from 'react-router-dom';

import NotFoundPage from 'components/NotFoundPage';
import { useSelector } from 'react-redux';
import { makeSelectUserCan, makeSelectUserCanAccess } from 'containers/App/selectors';

interface ProtectedRouteProps extends RouteProps {
  role?: string;
  roleGroup?: string;
  component?: any;
}

const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = ({ role, roleGroup, component: MyComponent, ...rest }) => {
  const userCan = useSelector(makeSelectUserCan);
  const userCanAccess = useSelector(makeSelectUserCanAccess);
  const hasAccess = useMemo(() => (role && userCan(role)) || (roleGroup && userCanAccess(roleGroup)), [
    role,
    roleGroup,
    userCan,
    userCanAccess,
  ]);

  return (
    <Route
      {...rest}
      render={props =>
        hasAccess ? <MyComponent {...props} /> : <NotFoundPage message="U heeft geen toegang tot deze pagina" />
      }
    />
  );
};

export default ProtectedRoute;
