// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react'
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import FileInputRenderer from '..'

describe('Form component <FileInputRenderer />', () => {
  const parentControls = {
    'input-field-name': {
      updateValueAndValidity: jest.fn(),
    },
  }

  const props = {
    handler: jest.fn(),
    touched: false,
    getError: jest.fn(),
    hasError: jest.fn(),
    parent: {
      meta: {
        updateIncident: jest.fn(),
      },
      value: jest.fn(),
      controls: parentControls,
    },
  }

  describe('rendering', () => {
    it('should render upload field correctly', () => {
      const { queryByTestId } = render(
        withAppContext(
          <FileInputRenderer
            {...props}
            meta={{
              isVisible: true,
            }}
          />
        )
      )

      expect(queryByTestId('fileInput')).toBeInTheDocument()
    })

    it('should render no upload field when not visible', () => {
      const { queryByTestId } = render(
        withAppContext(
          <FileInputRenderer
            {...props}
            meta={{
              isVisible: false,
            }}
          />
        )
      )

      expect(queryByTestId('fileInput')).not.toBeInTheDocument()
    })
  })
})
