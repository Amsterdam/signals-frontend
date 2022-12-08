// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import type { FormMeta } from 'types/reactive-form'

import FormField from '.'
import type { FormFieldProps } from './FormField'

describe('signals/incident/components/form/FormField', () => {
  const label = 'Foo barrrr'
  const props = {
    children: <div>childProp</div>,
    meta: {
      label,
      name: label,
      updateIncident: () => {},
    } as FormMeta,
    hasError: () => false,
    getError: () => '',
  } as FormFieldProps

  it('should render label', () => {
    render(withAppContext(<FormField {...props} />))

    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('should render fieldset with legend', () => {
    render(withAppContext(<FormField {...props} isFieldSet />))

    // Role 'group' asserts that a fieldset is rendered with a legend as its first child.
    expect(
      screen.getByRole('group', { name: /Foo barrrr/ })
    ).toBeInTheDocument()
  })

  it('should render optional indicator', () => {
    const { rerender } = render(
      withAppContext(<FormField {...props} options={{}} />)
    )

    expect(screen.queryByText('(niet verplicht)')).toBeInTheDocument()

    rerender(
      withAppContext(
        <FormField {...props} options={{ validators: undefined }} />
      )
    )

    expect(screen.queryByText('(niet verplicht)')).toBeInTheDocument()

    rerender(
      withAppContext(<FormField {...props} options={{ validators: [] }} />)
    )

    expect(screen.queryByText('(niet verplicht)')).toBeInTheDocument()

    rerender(
      withAppContext(
        <FormField
          {...props}
          meta={{ ...props.meta, label: undefined }}
          options={{}}
        />
      )
    )

    expect(screen.queryByText('(niet verplicht)')).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <FormField {...props} options={{ validators: ['required'] }} />
      )
    )

    expect(screen.queryByText('(niet verplicht)')).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <FormField {...props} options={{ validators: ['required'] }} />
      )
    )

    expect(screen.queryByText('(niet verplicht)')).not.toBeInTheDocument()
  })

  it('should render subtitle', () => {
    const subtitle = 'Bar bazzz'
    render(
      withAppContext(
        <FormField {...props} meta={{ ...props.meta, subtitle }} />
      )
    )

    expect(screen.getByText(subtitle)).toBeInTheDocument()
  })

  it('should render children', () => {
    const { container } = render(
      withAppContext(
        <FormField {...props}>
          <span className="child" />
        </FormField>
      )
    )

    expect(container.querySelector('.child')).toBeInTheDocument()
  })

  it('should render required error with default message', () => {
    const hasError = (prop: string) => prop === 'required'
    const getError = () => true
    const error = 'Dit is een verplicht veld'

    const { rerender } = render(withAppContext(<FormField {...props} />))

    expect(screen.queryByText(error)).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <FormField {...props} getError={getError} hasError={hasError} />
      )
    )

    expect(screen.queryByText(error)).toBeInTheDocument()
  })

  it('should render required error with custom message', () => {
    const error = 'Dit is een verplicht veld'
    const hasError = (prop: string) => prop === 'required'
    const getError = () => error

    const { rerender } = render(withAppContext(<FormField {...props} />))

    expect(screen.queryByText(error)).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <FormField {...props} getError={getError} hasError={hasError} />
      )
    )

    expect(screen.queryByText(error)).toBeInTheDocument()
  })

  it('should render email error', () => {
    const hasError = (prop: string) => prop === 'email'
    const error =
      'Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl'

    const { rerender } = render(withAppContext(<FormField {...props} />))

    expect(screen.queryByText(error)).not.toBeInTheDocument()

    rerender(withAppContext(<FormField {...props} hasError={hasError} />))

    expect(screen.queryByText(error)).toBeInTheDocument()
  })

  it('should render maxLength error', () => {
    const requiredLength = 300
    const hasError = (prop: string) => prop === 'max'
    const getError = () => requiredLength
    const error = `U heeft meer dan de maximale ${requiredLength} tekens ingevoerd`

    const { rerender } = render(
      withAppContext(<FormField {...props} getError={getError} />)
    )

    expect(screen.queryByText(error)).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <FormField {...props} hasError={hasError} getError={getError} />
      )
    )

    expect(screen.queryByText(error)).toBeInTheDocument()
  })

  it('should render custom error', () => {
    const error = 'Hic sunt dracones'
    const hasError = (prop: string) => prop === 'custom'
    const getError = () => error

    const { rerender } = render(
      withAppContext(<FormField {...props} getError={getError} />)
    )

    expect(screen.queryByText(error)).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <FormField {...props} hasError={hasError} getError={getError} />
      )
    )

    expect(screen.queryByText(error)).toBeInTheDocument()
  })

  /**
   * Remove test for now. The logic should be placed in the yup resolver.
   */
  // it('should not render error', () => {
  //   const hasError = (prop: string) => prop === 'required'
  //   const getError = () => true
  //   const error = 'Dit is een verplicht veld'
  //
  //   const { rerender } = render(
  //     withAppContext(<FormField {...props} hasError={hasError} />)
  //   )
  //
  //   expect(screen.queryByText(error)).not.toBeInTheDocument()
  //
  //   rerender(
  //     withAppContext(
  //       <FormField {...props} getError={getError} hasError={hasError} />
  //     )
  //   )
  //
  //   expect(screen.queryByText(error)).toBeInTheDocument()
  // })
})
