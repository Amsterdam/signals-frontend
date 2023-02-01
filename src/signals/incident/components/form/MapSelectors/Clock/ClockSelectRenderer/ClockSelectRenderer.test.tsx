// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import straatverlichtingKlokken from 'signals/incident/definitions/wizard-step-2-vulaan/straatverlichting-klokken'
import { withAppContext } from 'test/utils'
import incidentJson from 'utils/__tests__/fixtures/incident.json'

import ClockSelectRenderer from './ClockSelectRenderer'
import type { Meta } from '../../types'

jest.mock('../../Asset/AssetSelect', () => () => (
  <span data-testid="mock-asset-select" />
))

describe('signals/incident/components/form/ClockSelectRenderer', () => {
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
    label: 'Klok',
    isVisible: true,
    featureTypes: straatverlichtingKlokken.extra_klok_nummer.meta.featureTypes,
  } as unknown as Meta

  describe('rendering', () => {
    it('should render correctly', async () => {
      render(withAppContext(<ClockSelectRenderer {...props} meta={meta} />))
      expect(screen.getByTestId('mock-asset-select')).toBeInTheDocument()
    })

    it('should NOT render when not visible', () => {
      render(
        withAppContext(
          <ClockSelectRenderer
            {...props}
            meta={{ ...meta, isVisible: false }}
          />
        )
      )

      expect(screen.queryByTestId('mock-asset-select')).not.toBeInTheDocument()
    })
  })
})
