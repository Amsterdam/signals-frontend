// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import GlobalError from '..'

const defaultErrorMessage =
  'U hebt niet alle vragen beantwoord. Vul hieronder aan alstublieft.'

describe('Form component <GlobalError />', () => {
  const props = {
    meta: {
      name: 'global',
      label: 'Error message',
    },
    parent: {
      valid: false,
    },
  }

  describe('rendering', () => {
    it('does not render the error message initially', () => {
      render(withAppContext(<GlobalError {...props} />))

      expect(screen.queryByText(props.meta.label)).not.toBeInTheDocument()
    })

    it('renders the error message when touched', () => {
      render(
        withAppContext(
          <GlobalError
            {...{ ...props, parent: { valid: false } }}
          />
        )
      )

      expect(screen.getByText(props.meta.label)).toBeInTheDocument()
    })

    it('renders a default error message', () => {
      render(
        withAppContext(
          <GlobalError
            meta={{ name: 'global' }}
            parent={{ valid: false }}
          />
        )
      )

      expect(screen.getByText(defaultErrorMessage)).toBeInTheDocument()
    })

    it('does not render the error message when valid', () => {
      render(
        withAppContext(
          <GlobalError
            {...{ ...props, parent: { valid: true } }}
          />
        )
      )

      expect(screen.queryByText(props.meta.label)).not.toBeInTheDocument()
    })

    it('does not render the error message when valid', () => {
      render(
        withAppContext(
          <GlobalError
            {...{ ...props, parent: { valid: true } }}
          />
        )
      )

      expect(screen.queryByText(props.meta.label)).not.toBeInTheDocument()
    })
  })
})
