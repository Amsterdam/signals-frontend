// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { lazy, Suspense, useEffect } from 'react'

import ReactDOM from 'react-dom'

import LoadingIndicator from 'components/LoadingIndicator'

import { Wrapper } from './styled'
import { Header } from '../components/Header'
// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const IncidentMap = lazy(() => import('../components/IncidentMap/IncidentMap'))

export const IncidentMapContainer = () => {
  // TODO: IMPLEMENT PIWIK EVENT HERE
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(`virtualPageview: /meldingenkaart`)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const appHtmlElement = document.getElementById('app')!
  const map = (
    <Suspense fallback={<LoadingIndicator />}>
      <Wrapper>
        <Header />
        <IncidentMap />
      </Wrapper>
    </Suspense>
  )

  return ReactDOM.createPortal(map, appHtmlElement)
}
