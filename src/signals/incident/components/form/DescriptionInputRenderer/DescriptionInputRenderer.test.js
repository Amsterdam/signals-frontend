// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import DescriptionInputRenderer from '.'

describe('signals/incident/components/form/DescriptionInputRenderer', () => {
  const props = {
    handler: jest.fn(),
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

  describe('rendering', () => {
    it('should render correctly', async () => {
      const { queryByTestId } = render(
        withAppContext(
          <DescriptionInputRenderer
            {...props}
            meta={{
              isVisible: true,
              maxLength: 100,
            }}
          />
        )
      )
      const element = queryByTestId('descriptionInput')
      expect(element).toBeInTheDocument()
    })

    it('should NOT render when not visible', () => {
      const { queryByTestId } = render(
        withAppContext(
          <DescriptionInputRenderer
            {...props}
            meta={{
              isVisible: false,
              maxLength: 100,
            }}
          />
        )
      )

      expect(queryByTestId('descriptionInput')).not.toBeInTheDocument()
    })
  })
})
