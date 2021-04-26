// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import FeedbackStatus from '../FeedbackStatus'

describe('FeedbackStatus', () => {
  it('renders satisfied text', () => {
    render(
      withAppContext(
        <FeedbackStatus
          feedback={{
            is_satisfied: true,
            submitted_at: '2021-04-22T11:48:07.452326Z',
          }}
        />
      )
    )

    expect(screen.getByText('Tevreden')).toBeInTheDocument()
    expect(screen.getByText('Tevreden')).toHaveStyleRule(
      'color',
      expect.any(String)
    )
  })

  it('renders not satisfied text', () => {
    render(
      withAppContext(
        <FeedbackStatus
          feedback={{
            is_satisfied: false,
            submitted_at: '2021-04-22T11:48:07.452326Z',
          }}
        />
      )
    )

    expect(screen.getByText('Niet tevreden')).toBeInTheDocument()
    expect(screen.getByText('Niet tevreden')).toHaveStyleRule(
      'color',
      expect.any(String)
    )
  })

  it('renders feedback not yet requested text', () => {
    render(withAppContext(<FeedbackStatus feedback={null} />))

    expect(screen.getByText('-')).toBeInTheDocument()
    expect(screen.getByText('-')).not.toHaveStyleRule(
      'color',
      expect.any(String)
    )
  })

  it('renders not submitted text', () => {
    render(
      withAppContext(
        <FeedbackStatus
          feedback={{
            is_satisfied: null,
            submitted_at: null,
          }}
        />
      )
    )

    expect(screen.getByText('Niet ontvangen')).toBeInTheDocument()
    expect(screen.getByText('Niet ontvangen')).not.toHaveStyleRule(
      'color',
      expect.any(String)
    )
  })
})
