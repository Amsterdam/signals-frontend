// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'
import HandlingMessage from '..'

describe('Form component <HandlingMessage />', () => {
  const incidentContainer = {
    incident: {
      handling_message: 'Jaaaaa!\n\nNeee!',
    },
  }

  describe('rendering', () => {
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
  })
})
