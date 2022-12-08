// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import form from 'react-hook-form'
import { withAppContext } from 'test/utils'

import GlobalError from '../index'

const defaultErrorMessage =
  'U hebt niet alle vragen beantwoord. Vul hieronder aan alstublieft.'

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    formState: {
      errors: { name: 'wrong name' },
    },
  }),
}))

describe('Form component <GlobalError />', () => {
  const props = {
    meta: {
      name: 'global',
      label: 'Error message',
    },
  }

  describe('rendering', () => {
    it('renders the error message when there is one in formState', () => {
      render(withAppContext(<GlobalError {...{ ...props }} />))

      expect(screen.getByText(props.meta.label)).toBeInTheDocument()
    })

    it('does not render error message', () => {
      jest.spyOn(form, 'useFormContext').mockImplementationOnce(() => ({
        formState: {
          errors: null,
        },
      }))
      render(withAppContext(<GlobalError {...{ ...props }} />))

      expect(screen.queryByText(props.meta.label)).toBe(null)
    })

    it('renders a default error message', () => {
      render(withAppContext(<GlobalError meta={{ name: 'global' }} />))

      expect(screen.getByText(defaultErrorMessage)).toBeInTheDocument()
    })
  })
})
