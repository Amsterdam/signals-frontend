// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import React from 'react'
import { withAppContext } from 'test/utils'
import incidentJson from 'utils/__tests__/fixtures/incident.json'
import ContainerSelectRenderer from './ContainerSelectRenderer'

describe('signals/incident/components/form/ContainerSelectRenderer', () => {
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
    label: 'Container',
    isVisible: true,
  }

  describe('rendering', () => {
    it('should render correctly', async () => {
      render(withAppContext(<ContainerSelectRenderer {...props} meta={meta} />))

      const element = screen.queryByTestId('containerSelectIntro')
      expect(element).toBeInTheDocument()
    })

    it('should NOT render when not visible', () => {
      render(
        withAppContext(
          <ContainerSelectRenderer
            {...props}
            meta={{ ...meta, isVisible: false }}
          />
        )
      )

      expect(
        screen.queryByTestId('containerSelectIntro')
      ).not.toBeInTheDocument()
    })
  })
})
