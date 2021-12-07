// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FormMeta } from 'types/reactive-form'

import { withAppContext } from 'test/utils'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MultiTextInputProps } from '../MultiTextInput'
import MultiTextInput from '..'

describe('Form component <MultiTextInput />', () => {
  const meta: FormMeta = {
    name: 'input-field-name',
    type: 'text',
    label: 'field label',
    placeholder: 'type here',
    subtitle: 'subtitle',
    isVisible: true,
  }

  const props = {
    handler: jest.fn(),
    parent: {
      meta: {
        updateIncident: jest.fn(),
      },
    },
    touched: false,
    hasError: jest.fn(),
    getError: jest.fn(),
    value: [''],
  } as MultiTextInputProps

  beforeEach(() => {
    ;(props.handler as jest.Mock).mockImplementation(() => ({
      value: ['Lorem'],
    }))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('rendering', () => {
    it('should not render when no metadata', () => {
      render(withAppContext(<MultiTextInput {...props} meta={undefined} />))

      expect(screen.queryByText('field label')).not.toBeInTheDocument()
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('should render multi text correctly', () => {
      const { rerender } = render(
        withAppContext(
          <MultiTextInput {...props} meta={{ ...meta, isVisible: false }} />
        )
      )

      expect(screen.queryByText('field label')).not.toBeInTheDocument()
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

      rerender(
        withAppContext(
          <MultiTextInput {...props} meta={{ ...meta, isVisible: true }} />
        )
      )

      expect(screen.getByText('field label')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render multi text without value correctly', () => {
      ;(props.handler as jest.Mock).mockImplementation(() => ({
        value: undefined,
      }))

      render(
        withAppContext(
          <MultiTextInput {...props} meta={{ ...meta, isVisible: true }} />
        )
      )

      expect(screen.getByText('field label')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    describe('events', () => {
      it('should set incident when value changes', () => {
        render(
          withAppContext(
            <MultiTextInput {...props} meta={{ ...meta, isVisible: true }} />
          )
        )

        const input = screen.getByRole('textbox')
        userEvent.type(input, '5')
        meta.name &&
          expect(props.parent.meta.updateIncident).toHaveBeenLastCalledWith({
            [meta.name]: ['Lorem5'],
          })
      })

      it('should add a text field when button is clicked', () => {
        render(
          withAppContext(
            <MultiTextInput {...props} meta={{ ...meta, isVisible: true }} />
          )
        )

        const button = screen.getByRole('button')
        userEvent.click(button)
        meta.name &&
          expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
            [meta.name]: ['Lorem', ''],
          })
      })

      it('should prevent invalid character input', () => {
        render(
          withAppContext(
            <MultiTextInput {...props} meta={{ ...meta, isVisible: true }} />
          )
        )

        const input = screen.getByRole('textbox')
        userEvent.type(input, '@')
        expect(props.parent.meta.updateIncident).not.toHaveBeenCalled()

        userEvent.type(input, '5')
        expect(props.parent.meta.updateIncident).toHaveBeenCalled()
      })
    })
  })
})
