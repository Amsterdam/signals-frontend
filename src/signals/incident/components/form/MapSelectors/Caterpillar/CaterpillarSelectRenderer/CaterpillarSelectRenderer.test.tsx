// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import incidentJson from 'utils/__tests__/fixtures/incident.json'
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/openbaarGroenEnWater'
import type { Meta } from '../../Asset/types'
import CaterpillarSelectRenderer from './CaterpillarSelectRenderer'

describe('signals/incident/components/form/MapSelectors/Caterpillar/CaterpillarSelectRenderer', () => {
  const props = {
    handler: jest.fn(() => ({
      value: [],
    })),
    touched: false,
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

  describe('rendering', () => {
    it('should render correctly', async () => {
      render(
        withAppContext(<CaterpillarSelectRenderer {...props} meta={meta} />)
      )

      const element = screen.queryByTestId('assetSelectIntro')
      expect(element).toBeInTheDocument()
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

      expect(screen.queryByTestId('selectIntro')).not.toBeInTheDocument()
    })
  })
})
