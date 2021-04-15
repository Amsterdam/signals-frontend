// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import userEvent from '@testing-library/user-event'
import type { FormMeta } from 'types/reactive-form'
import TextareaInput from '..'
import type { TextAreaInputProps } from '../TextareaInput'

describe('Form component <TextareaInput />', () => {
  const meta: FormMeta = {
    name: 'input-field-name',
    placeholder: 'type here',
    isVisible: true,
  }

  const props = {
    handler: jest.fn(),
    touched: false,
    hasError: jest.fn(),
    getError: jest.fn(),
    parent: {
      meta: {
        name: 'test-input',
        updateIncident: jest.fn(),
      },
    },
    value: '',
  } as TextAreaInputProps

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('rendering', () => {
    it('should render text area field correctly', () => {
      render(withAppContext(<TextareaInput {...props} meta={{ ...meta }} />))
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(props.handler).toHaveBeenCalledWith()
    })

    it('should render no text area field when not visible', () => {
      render(
        withAppContext(
          <TextareaInput {...props} meta={{ ...meta, isVisible: false }} />
        )
      )
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(props.handler).not.toHaveBeenCalledWith()
    })

    it('should render no text area field when no metadata provided', () => {
      render(withAppContext(<TextareaInput {...props} />))
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(props.handler).not.toHaveBeenCalledWith()
    })

    it('should render character counter correctly', () => {
      render(
        withAppContext(
          <TextareaInput {...props} meta={{ ...meta, maxLength: 300 }} />
        )
      )
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByText('0/300 tekens')).toBeInTheDocument()
    })

    it('should render character counter with value correctly', () => {
      render(
        withAppContext(
          <TextareaInput
            {...props}
            meta={{ ...meta, maxLength: 300 }}
            value="test"
          />
        )
      )
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      expect(screen.getByText('4/300 tekens')).toBeInTheDocument()
    })
  })

  describe('events', () => {
    it('sets incident when value changes', async () => {
      render(
        withAppContext(
          <TextareaInput {...props} meta={{ ...meta, maxLength: 300 }} />
        )
      )
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      userEvent.type(input, 'diabolo')
      userEvent.tab()

      await waitFor(() => {
        expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name': 'diabolo',
        })
      })
    })

    it('sets incident when value changes and removed unwanted characters', async () => {
      render(
        withAppContext(
          <TextareaInput {...props} meta={{ ...meta, autoRemove: /[aio]*/g }} />
        )
      )
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      userEvent.type(input, 'diabolo')
      userEvent.tab()

      await waitFor(() => {
        expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name': 'dbl',
        })
      })
    })
  })
})
