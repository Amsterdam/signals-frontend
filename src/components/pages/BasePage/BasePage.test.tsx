import { render, waitFor, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import configuration from 'shared/services/configuration/configuration'

import BasePage from './BasePage'

describe('BasePage', () => {
  it('renders a default document title', async () => {
    render(withAppContext(<BasePage />))

    expect(screen.getByTestId('basePage')).toBeInTheDocument()

    await waitFor(() => {
      expect(document.title).toEqual(configuration.language.siteTitle)
    })
  })

  it('applies other props', () => {
    render(withAppContext(<BasePage data-testid="overwriteTestId" />))

    expect(screen.queryByTestId('basePage')).not.toBeInTheDocument()

    expect(screen.getByTestId('overwriteTestId')).toBeInTheDocument()
  })

  it('renders a custom document title', async () => {
    render(withAppContext(<BasePage documentTitle="Foo Bar" />))

    await waitFor(() => {
      expect(document.title).toEqual(
        `${configuration.language.siteTitle} - Foo Bar`
      )
    })
  })

  it('renders a page title', () => {
    render(withAppContext(<BasePage pageTitle="Zork!!!1!" />))

    expect(screen.getByRole('heading')).toHaveTextContent('Zork!!!1!')
  })

  it('renders children', () => {
    render(
      withAppContext(
        <BasePage>
          <span data-testid="child">barrr</span>
        </BasePage>
      )
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByTestId('child')).toHaveTextContent('barrr')
  })
})
