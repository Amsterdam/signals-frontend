// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import incidentJson from 'utils/__tests__/fixtures/incident.json'
import { Meta } from '../types'
import CaterpillarSelectRenderer from './CaterpillarSelectRenderer'

describe('signals/incident/components/form/CaterpillarSelectRenderer', () => {
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
      controls: {},
    },
    validatorsOrOpts: {},
  }

  const meta = {
    label: 'Caterpillar',
    isVisible: true,
  } as unknown as Meta

  describe('rendering', () => {
    it('should render correctly', async () => {
      render(
        withAppContext(<CaterpillarSelectRenderer {...props} meta={meta} />)
      )

      const element = screen.queryByTestId('selectIntro')
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
