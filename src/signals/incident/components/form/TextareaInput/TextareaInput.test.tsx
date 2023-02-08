// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'
import type { FormMeta } from 'types/reactive-form'

import type { TextAreaInputProps } from './TextareaInput'
import TextareaInput from './TextareaInput'

describe('Form component <TextareaInput />', () => {
  const meta: FormMeta = {
    name: 'input-field-name',
    placeholder: 'type here',
    isVisible: true,
  }

  const props = {
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
    })

    it('should render no text area field when not visible', () => {
      render(
        withAppContext(
          <TextareaInput {...props} meta={{ ...meta, isVisible: false }} />
        )
      )
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('should render no text area field when no metadata provided', () => {
      render(withAppContext(<TextareaInput {...props} />))
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
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
  })
})
