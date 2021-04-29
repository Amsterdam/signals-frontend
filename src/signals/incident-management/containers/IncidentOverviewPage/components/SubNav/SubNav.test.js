// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { render } from '@testing-library/react'

import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'

import SubNav from '.'

jest.mock('shared/services/configuration/configuration')

describe('signals/incident-management/containers/IncidentOverviewPage/components/SubNav', () => {
  afterEach(() => {
    configuration.__reset()
  })

  it('should render tabs with link to map by default', () => {
    const { queryByTestId } = render(withAppContext(<SubNav />))

    expect(queryByTestId('subNavMapLink')).toBeInTheDocument()
    expect(queryByTestId('subNavListLink')).not.toBeInTheDocument()
  })

  it('should render tabs with link to list when showsMap is true', () => {
    const { queryByTestId } = render(withAppContext(<SubNav showsMap />))

    expect(queryByTestId('subNavMapLink')).not.toBeInTheDocument()
    expect(queryByTestId('subNavListLink')).toBeInTheDocument()
  })

  it('should render last 24 hours header when showing the map', () => {
    configuration.featureFlags.mapFilter24Hours = true

    const { queryByText } = render(withAppContext(<SubNav showsMap />))

    expect(queryByText('Afgelopen 24 uur')).toBeInTheDocument()
  })

  it('should not render last 24 hours header when mapFilter24Hours feature flag is disabled', () => {
    const { queryByText } = render(withAppContext(<SubNav showsMap />))

    expect(queryByText('Afgelopen 24 uur')).not.toBeInTheDocument()
  })
})
