// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import incidentJson from 'utils/__tests__/fixtures/incident.json'
import straatverlichtingKlokken from 'signals/incident/definitions/wizard-step-2-vulaan/straatverlichting-klokken'

import type { Meta } from '../../types'

import ClockSelectRenderer from './ClockSelectRenderer'

jest.mock('../../Asset/AssetSelect', () => () => (
  <span data-testid="mockAssetSelect" />
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
      expect(screen.getByTestId('mockAssetSelect')).toBeInTheDocument()
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

      expect(screen.queryByTestId('mockAssetSelect')).not.toBeInTheDocument()
    })
  })
})
