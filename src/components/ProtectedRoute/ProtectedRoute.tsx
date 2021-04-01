// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React, { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import type { RouteComponentProps, RouteProps } from 'react-router-dom';
import { Route } from 'react-router-dom';

import NotFoundPage from 'components/NotFoundPage';
import { useSelector } from 'react-redux';
import { makeSelectUserCan, makeSelectUserCanAccess } from 'containers/App/selectors';

export const NO_PAGE_ACCESS_MESSAGE = 'U heeft geen toegang tot deze pagina';

interface ProtectedRouteProps extends RouteProps {
  role?: string;
  roleGroup?: string;
  component: (props: RouteComponentProps<any>) => JSX.Element;
}

const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = ({ role, roleGroup, component: Component, ...rest }) => {
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
        hasAccess ? <Component {...props} /> : <NotFoundPage message={NO_PAGE_ACCESS_MESSAGE} />
      }
    />
  );
};

export default ProtectedRoute;
