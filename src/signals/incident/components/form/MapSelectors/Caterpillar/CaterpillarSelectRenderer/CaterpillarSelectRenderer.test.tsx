// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import incidentJson from 'utils/__tests__/fixtures/incident.json'

import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/eikenprocessierups'

import type { Meta } from '../../types'

import CaterpillarSelectRenderer from './CaterpillarSelectRenderer'

jest.mock('../../Asset/AssetSelect', () => () => (
  <span data-testid="mockAssetSelect" />
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

    expect(screen.getByTestId('mockAssetSelect')).toBeInTheDocument()
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

    expect(screen.queryByTestId('mockAssetSelect')).not.toBeInTheDocument()
  })
})
