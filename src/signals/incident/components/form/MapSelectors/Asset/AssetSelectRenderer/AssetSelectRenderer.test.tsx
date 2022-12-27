// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import incidentJson from 'utils/__tests__/fixtures/incident.json'

import AssetSelectRenderer from './AssetSelectRenderer'

jest.mock('../AssetSelect', () => () => (
  <span data-testid="mock-asset-select" />
))

describe('signals/incident/components/form/AssetSelectRenderer', () => {
  const props = {
    handler: jest.fn(() => ({
      value: [],
    })),
    getError: jest.fn(),
    hasError: jest.fn(),
    value: 'the-value',
    parent: {
      meta: {
        incidentContainer: { incident: incidentJson },
        updateIncident: jest.fn(),
      },
      controls: {},
    },
    validatorsOrOpts: {},
  }

  const meta = {
    label: 'Asset',
    isVisible: true,
    featureTypes: [],
    featureStatusTypes: [],
    endpoint: '',
  }

  describe('rendering', () => {
    it('should render correctly', async () => {
      render(withAppContext(<AssetSelectRenderer {...props} meta={meta} />))

      expect(screen.getByTestId('mock-asset-select')).toBeInTheDocument()
    })

    it('should NOT render when not visible', () => {
      render(
        withAppContext(
          <AssetSelectRenderer
            {...props}
            meta={{ ...meta, isVisible: false }}
          />
        )
      )

      expect(screen.queryByTestId('mock-asset-select')).not.toBeInTheDocument()
    })
  })
})
