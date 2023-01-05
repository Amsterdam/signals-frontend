// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { render } from '@testing-library/react'

import { getIsAuthenticated } from 'shared/services/auth/auth'
import { withAppContext } from 'test/utils'

import CategorySelectRenderer from './CategorySelectRenderer'

jest.mock('shared/services/auth/auth')
jest.mock('signals/incident/components/form/CategorySelect', () => () => (
  <div data-testid="description-input"></div>
))

describe('signals/incident/components/form/CategorySelectRenderer', () => {
  const props = {
    handler: jest.fn(() => ({
      value: {
        sub_category: 'baz',
        name: 'Baz',
        slug: 'baz',
      },
    })),
    getError: jest.fn(),
    hasError: jest.fn(),
    value: 'the-description',
    parent: {
      meta: {
        updateIncident: jest.fn(),
      },
      controls: {},
    },
    validatorsOrOpts: {},
  }

  const meta = {
    label: 'Subcategorie',
    path: 'category',
    name: 'category',
    isVisible: true,
  }

  beforeEach(() => {
    getIsAuthenticated.mockImplementation(() => true)
  })

  describe('rendering', () => {
    it('should render correctly', async () => {
      const { queryByTestId } = render(
        withAppContext(<CategorySelectRenderer {...props} meta={meta} />)
      )

      const element = queryByTestId('description-input')
      expect(element).toBeInTheDocument()
    })

    it('should NOT render when not visible', () => {
      const { queryByTestId } = render(
        withAppContext(
          <CategorySelectRenderer
            {...props}
            meta={{ ...meta, isVisible: false }}
          />
        )
      )

      expect(queryByTestId('description-input')).not.toBeInTheDocument()
    })

    it('should NOT render when not authenticated', () => {
      getIsAuthenticated.mockImplementation(() => false)
      const { queryByTestId } = render(
        withAppContext(
          <CategorySelectRenderer
            {...props}
            meta={{ ...meta, isVisible: true }}
          />
        )
      )

      expect(queryByTestId('description-input')).not.toBeInTheDocument()
    })
  })
})
