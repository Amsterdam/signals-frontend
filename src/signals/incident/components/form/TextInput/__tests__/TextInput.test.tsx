// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import userEvent from '@testing-library/user-event'
import type { FormMeta } from 'types/reactive-form'
import TextInput from '..'
import type { TextInputProps } from '../TextInput'

describe('Form component <TextInput />', () => {
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
    value: '',
  } as TextInputProps

  describe('rendering', () => {
    it('should not render when no metadata', () => {
      render(withAppContext(<TextInput {...props} meta={undefined} />))

      expect(screen.queryByText('field label')).not.toBeInTheDocument()
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('should render text field correctly', () => {
      const { rerender } = render(
        withAppContext(
          <TextInput {...props} meta={{ ...meta, isVisible: false }} />
        )
      )

      expect(screen.queryByText('field label')).not.toBeInTheDocument()
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

      rerender(
        withAppContext(
          <TextInput {...props} meta={{ ...meta, isVisible: true }} />
        )
      )

      expect(screen.getByText('field label')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('events', () => {
    it('sets incident when value changes', () => {
      render(
        withAppContext(
          <TextInput {...props} meta={{ ...meta, isVisible: true }} />
        )
      )

      const input = screen.getByRole('textbox')
      userEvent.type(input, 'diabolo')
      userEvent.tab()

      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        [meta.name]: 'diabolo',
      })
    })

    it('sets incident when value changes and removed unwanted characters', () => {
      render(
        withAppContext(
          <TextInput
            {...props}
            meta={{ ...meta, autoRemove: /[bdl]*/g, isVisible: true }}
          />
        )
      )

      const input = screen.getByRole('textbox')
      userEvent.type(input, 'diabolo')
      userEvent.tab()

      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        [meta.name]: 'iaoo',
      })
    })
  })
})
