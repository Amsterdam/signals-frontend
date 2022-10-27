import { Suspense } from 'react'

import type { Location } from 'history'
import { Redirect, Route, Switch } from 'react-router-dom'

import LoadingIndicator from 'components/LoadingIndicator'
import useLocationReferrer from 'hooks/useLocationReferrer'

import { routes } from '../definitions'
import { Confirmation, LinkExpired, RequestAccess } from '../pages'

export const Routing = () => {
  const location = useLocationReferrer() as Location

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Switch location={location}>
        <Redirect exact from={routes.baseUrl} to={routes.requestAccess} />
        <Route exact path={routes.requestAccess} component={RequestAccess} />
        <Route exact path={routes.confirm} component={Confirmation} />
        <Route exact path={routes.expired} component={LinkExpired} />
      </Switch>
    </Suspense>
  )
}
