// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'

import HandlingMessage from './HandlingMessage'

describe('Form component <HandlingMessage />', () => {
  const incidentContainer = {
    incident: {
      handling_message: 'Jaaaaa!\n\nNeee!',
    },
  }

  it('should render handling message correctly', () => {
    render(
      <HandlingMessage
        meta={{
          name: 'handling_message',
          title: 'Foo!',
          key: 'incident.handling_message',
          isVisible: true,
        }}
        parent={{
          meta: {
            incidentContainer,
          },
        }}
      />
    )

    expect(screen.getByRole('heading', { name: 'Foo!' })).toBeInTheDocument()
    expect(screen.getByText('Jaaaaa!')).toBeInTheDocument()
    expect(screen.getByText('Neee!')).toBeInTheDocument()
  })

  it('should render empty correctly with no handling message', () => {
    render(
      <HandlingMessage
        meta={{
          name: 'handling_message',
          title: 'Foo!',
          key: 'incident.handling_message',
          isVisible: true,
        }}
        parent={{
          meta: {},
        }}
      />
    )

    expect(
      screen.getByText('We gaan zo snel mogelijk aan de slag.')
    ).toBeInTheDocument()
  })

  it('should render no handling message when not visible', () => {
    render(
      <HandlingMessage
        meta={{
          name: 'handling_message',
          title: 'Foo!',
          key: 'incident.handling_message',
          isVisible: false,
        }}
        parent={{
          meta: {},
        }}
      />
    )

    expect(screen.queryByText('Foo!')).not.toBeInTheDocument()
  })

  it('converts Markdown to HTML', () => {
    const link = 'https://github.com'
    const handling_message = `This will print as [a link](${link})`
    render(
      <HandlingMessage
        meta={{
          name: 'handling_message',
          title: 'Foo!',
          key: 'incident.handling_message',
          isVisible: true,
        }}
        parent={{
          meta: {
            incidentContainer: {
              incident: {
                handling_message,
              },
            },
          },
        }}
      />
    )

    expect(screen.queryByRole('link')).toHaveAttribute('href', link)
  })

  it('does not convert unallowed Markdown', () => {
    const handling_message = '# Here is an h1'
    render(
      <HandlingMessage
        meta={{
          name: 'handling_message',
          title: 'Foo!',
          key: 'incident.handling_message',
          isVisible: true,
        }}
        parent={{
          meta: {
            incidentContainer: {
              incident: {
                handling_message,
              },
            },
          },
        }}
      />
    )

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })
})
