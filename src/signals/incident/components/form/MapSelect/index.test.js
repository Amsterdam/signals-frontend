// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

jest.mock('shared/services/configuration/configuration')

const parent = {
  meta: {
    updateIncident: jest.fn(),
  },
}

const meta = {
  name: 'my_question',
  idField: 'idField',
  isVisible: true,
  endpoint: 'foo/bar?',
  legend_items: ['klok'],
}

const handler = () => ({ value: 'foo' })

describe('MapSelect', () => {
  it('should render the generic map component with featrue flag enabled', () => {
    configuration.featureFlags.useMapSelectGeneric = true
    const MapSelect = require('./index.js').default
    render(
      withAppContext(
        <MapSelect parent={parent} meta={meta} handler={handler} />
      )
    )

    expect(screen.queryByTestId('mapSelectGeneric')).toBeInTheDocument()
  })
})
