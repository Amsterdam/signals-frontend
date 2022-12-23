// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'
import history from 'utils/__tests__/fixtures/history.json'

import ChildIncidentHistory from '..'

describe('<ChildIncidentHistory />', () => {
  const NEW_EVENT = history[0].action
  const OLD_EVENT = history[1].action

  describe('incident has recent history', () => {
    it('should render incident history', () => {
      render(
        withAppContext(
          <ChildIncidentHistory
            canView
            history={history}
            parentUpdatedAt={history[1].when}
          />
        )
      )

      expect(screen.queryByText(NEW_EVENT)).toBeInTheDocument()
      expect(screen.queryByText(OLD_EVENT)).not.toBeInTheDocument()
    })

    it('should render toggle to show and hide older history', () => {
      render(
        withAppContext(
          <ChildIncidentHistory
            canView
            history={history}
            parentUpdatedAt={history[1].when}
          />
        )
      )
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
      expect(screen.queryByText(NEW_EVENT)).toBeInTheDocument()
      expect(screen.queryByText(OLD_EVENT)).not.toBeInTheDocument()

      userEvent.click(screen.getByRole('link', { name: 'Toon geschiedenis' }))

      expect(screen.getAllByRole('listitem')).toHaveLength(4)
      expect(screen.queryByText(NEW_EVENT)).toBeInTheDocument()
      expect(screen.queryByText(OLD_EVENT)).toBeInTheDocument()

      userEvent.click(
        screen.getByRole('link', { name: 'Verberg geschiedenis' })
      )

      expect(screen.getAllByRole('listitem')).toHaveLength(1)
      expect(screen.queryByText(NEW_EVENT)).toBeInTheDocument()
      expect(screen.queryByText(OLD_EVENT)).not.toBeInTheDocument()
    })
  })

  describe('incident has no history', () => {
    it('should render nothing', () => {
      render(
        withAppContext(
          <ChildIncidentHistory canView parentUpdatedAt={history[0].when} />
        )
      )

      expect(screen.queryByText(NEW_EVENT)).not.toBeInTheDocument()
      expect(screen.queryByText(OLD_EVENT)).not.toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: 'Toon geschiedenis' })
      ).not.toBeInTheDocument()
    })
  })

  describe('user has no permission to view incident', () => {
    it('should render error message', () => {
      render(
        withAppContext(
          <ChildIncidentHistory
            canView={false}
            history={history}
            parentUpdatedAt={history[0].when}
          />
        )
      )

      expect(screen.queryByText(NEW_EVENT)).not.toBeInTheDocument()
      expect(screen.queryByText(OLD_EVENT)).not.toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: /geschiedenis/ })
      ).not.toBeInTheDocument()

      expect(
        screen.queryByText(
          'Je hebt geen toestemming om meldingen in deze categorie te bekijken'
        )
      ).toBeInTheDocument()
    })
  })

  describe('incident has no recent history', () => {
    it('should render info message', () => {
      render(
        withAppContext(
          <ChildIncidentHistory
            canView
            history={history}
            parentUpdatedAt={history[0].when}
          />
        )
      )

      expect(screen.queryAllByRole('listitem')).toHaveLength(0)
      expect(screen.queryByText('Geen nieuwe wijzigingen')).toBeInTheDocument()
    })

    it('should render toggle to show all history', () => {
      render(
        withAppContext(
          <ChildIncidentHistory
            canView
            history={history}
            parentUpdatedAt={history[0].when}
          />
        )
      )

      expect(screen.queryAllByRole('listitem')).toHaveLength(0)
      expect(screen.queryByText('Geen nieuwe wijzigingen')).toBeInTheDocument()

      userEvent.click(screen.getByRole('link', { name: 'Toon geschiedenis' }))

      expect(screen.queryAllByRole('listitem')).toHaveLength(4)
      expect(screen.queryByText('Geen nieuwe wijzigingen')).toBeInTheDocument()

      userEvent.click(
        screen.getByRole('link', { name: 'Verberg geschiedenis' })
      )

      expect(screen.queryAllByRole('listitem')).toHaveLength(0)
      expect(screen.queryByText('Geen nieuwe wijzigingen')).toBeInTheDocument()
    })
  })
})
