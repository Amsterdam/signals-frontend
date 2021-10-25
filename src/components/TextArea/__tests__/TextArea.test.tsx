// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import TextArea from '..'

describe('components/TextArea', () => {
  it('renders correctly', () => {
    const { container } = render(
      withAppContext(<TextArea cols={40} rows={5} className="txtArea" />)
    )
    expect(
      container.querySelector('textarea[cols="40"][rows="5"].txtArea')
    ).toBeInTheDocument()
  })

  it('renders the info text', () => {
    render(
      withAppContext(
        <TextArea
          cols={40}
          rows={5}
          infoText="You have entered 0/10 characters"
        />
      )
    )

    expect(
      screen.getByText('You have entered 0/10 characters')
    ).toBeInTheDocument()
  })

  it('renders label', () => {
    render(withAppContext(<TextArea label="Notitie" />))

    expect(screen.getByText('Notitie')).toBeInTheDocument()
  })

  it('renders error', () => {
    render(withAppContext(<TextArea errorMessage="Dit veld is verplicht" />))

    expect(screen.getByText('Dit veld is verplicht')).toBeInTheDocument()
  })

  it('prefers defaultValue over value', () => {
    render(
      withAppContext(
        <TextArea
          cols={40}
          rows={5}
          infoText="You have entered 0/10 characters"
          defaultValue="Foo bar"
          value="Zork"
        />
      )
    )

    expect(screen.getByRole('textbox')).toHaveTextContent('Foo bar')
    userEvent.type(screen.getByRole('textbox'), ' baz')
    expect(screen.getByRole('textbox')).toHaveTextContent('Foo bar baz')
  })

  it('calls onChange', () => {
    const onChange = jest.fn()

    render(
      withAppContext(
        <TextArea
          onChange={onChange}
          infoText="You have entered 0/10 characters"
          value="Zork"
        />
      )
    )

    expect(screen.getByRole('textbox')).toHaveTextContent('Zork')

    userEvent.type(screen.getByRole('textbox'), '!!')

    expect(screen.getByRole('textbox')).toHaveTextContent('Zork!!')
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('renders max character length as info text', () => {
    const maxContentLength = 100

    render(withAppContext(<TextArea maxContentLength={maxContentLength} />))

    expect(
      screen.getByText(`0 / ${maxContentLength} tekens`)
    ).toBeInTheDocument()

    render(
      withAppContext(
        <TextArea
          maxContentLength={maxContentLength}
          defaultValue="Enter here"
        />
      )
    )

    expect(
      screen.getByText(`10 / ${maxContentLength} tekens`)
    ).toBeInTheDocument()

    render(
      withAppContext(
        <TextArea maxContentLength={maxContentLength} value="Dragons!" />
      )
    )

    expect(
      screen.getByText(`8 / ${maxContentLength} tekens`)
    ).toBeInTheDocument()
  })
})
