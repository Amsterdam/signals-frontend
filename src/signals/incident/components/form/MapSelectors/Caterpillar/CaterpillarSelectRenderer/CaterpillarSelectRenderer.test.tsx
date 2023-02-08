// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/eikenprocessierups'
import { withAppContext } from 'test/utils'
import incidentJson from 'utils/__tests__/fixtures/incident.json'

import CaterpillarSelectRenderer from './CaterpillarSelectRenderer'
import type { Meta } from '../../types'

jest.mock('../../Asset/AssetSelect', () => () => (
  <span data-testid="mock-asset-select" />
))

describe('signals/incident/components/form/MapSelectors/Caterpillar/CaterpillarSelectRenderer', () => {
  const props = {
    handler: jest.fn(() => ({
      value: undefined,
    })),
    getError: jest.fn(),
    hasError: jest.fn(),
    value: 'the-value',
    parent: {
      meta: {
        incidentContainer: { incident: incidentJson },
        updateIncident: jest.fn(),
      },
      controls,
    },
    validatorsOrOpts: {},
  }

  const meta = {
    label: 'Caterpillar',
    isVisible: true,
    featureTypes: controls.extra_eikenprocessierups.meta.featureTypes,
  } as unknown as Meta

  it('should render correctly', async () => {
    render(withAppContext(<CaterpillarSelectRenderer {...props} meta={meta} />))

    expect(screen.getByTestId('mock-asset-select')).toBeInTheDocument()
  })

  it('should NOT render when not visible', () => {
    render(
      withAppContext(
        <CaterpillarSelectRenderer
          {...props}
          meta={{ ...meta, isVisible: false }}
        />
      )
    )

    expect(screen.queryByTestId('mock-asset-select')).not.toBeInTheDocument()
  })
})
