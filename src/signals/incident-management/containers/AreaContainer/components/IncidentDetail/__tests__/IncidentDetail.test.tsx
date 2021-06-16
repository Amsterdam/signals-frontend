import { render, screen } from '@testing-library/react'
import { mockIncident } from 'types/api/incident.mock'
import { withAppContext } from 'test/utils'
import IncidentDetail from '../'

const defaults = mockIncident()

describe('IncidentDetail', () => {
  it('should render', () => {
    render(
      withAppContext(
        <IncidentDetail incident={mockIncident()} onBack={jest.fn()} />
      )
    )
  })

  it('should show the correct incident properties', () => {
    const incident = mockIncident({
      text: 'incident text',
      created_at: new Date(0).toISOString(),
      location: {
        ...defaults.location,
        address_text: '124 Conch St., Bikini Bottom',
      },
      status: {
        ...defaults.status,
        state_display: 'Gemeld',
      },
      category: {
        sub: 'Spongebob',
        departments: 'Patrick',
        sub_slug: 'overig-afval',
        main: 'foo',
        main_slug: 'foo',
        category_url: 'foo',
        created_by: 'foo',
        text: null,
        deadline: 'foo',
        deadline_factor_3: 'foo',
      },
    })

    render(
      withAppContext(<IncidentDetail incident={incident} onBack={jest.fn()} />)
    )

    expect(screen.getByTestId('text').textContent?.trim()).toEqual(
      'incident text'
    )
    expect(screen.getByTestId('location').textContent?.trim()).toEqual(
      '124 Conch St., Bikini Bottom'
    )
    expect(screen.getByTestId('date').textContent?.trim()).toEqual(
      '01-01-1970 01:00'
    )
    expect(screen.getByTestId('status').textContent?.trim()).toEqual('Gemeld')
    expect(screen.getByTestId('departments').textContent?.trim()).toEqual(
      '(Patrick)'
    )
    expect(screen.getByTestId('subcategory').textContent?.trim()).toEqual(
      'Spongebob'
    )
  })

  it('should call the onBack callback when clicking on "Terug naar filter"', () => {
    const spy = jest.fn()

    render(
      withAppContext(<IncidentDetail incident={mockIncident()} onBack={spy} />)
    )

    const link = screen.getByRole('link', { name: 'Terug naar filter' })

    link.click()

    expect(spy).toHaveBeenCalled()
  })

  it('should render a link to the incident that opens in a new window', () => {
    const incident = mockIncident({
      _links: {
        ...defaults._links,
        'sia:children': undefined,
      },
      id: 1234,
    })

    render(
      withAppContext(<IncidentDetail incident={incident} onBack={jest.fn()} />)
    )

    const link = screen.getByRole('link', { name: 'Standaardmelding 1234' })

    expect(link).toHaveAttribute('href', '/manage/incident/1234')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('should display the correct text for parent or default incidents', () => {
    const mainIncident = mockIncident({
      _links: {
        ...defaults._links,
        'sia:children': [{ href: 'foo' }],
      },
      id: 1234,
    })

    const defaultIncident = mockIncident({
      _links: {
        ...defaults._links,
        'sia:children': undefined,
      },
      id: 4321,
    })

    const partialIncident = mockIncident({
      _links: {
        ...defaults._links,
        'sia:parent': { href: 'foo' },
      },
      id: 5678,
    })

    const { rerender, unmount } = render(
      withAppContext(
        <IncidentDetail incident={mainIncident} onBack={jest.fn()} />
      )
    )

    expect(
      screen.queryByRole('link', { name: 'Standaardmelding 1234' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Deelmelding 1234' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Hoofdmelding 1234' })
    ).toBeInTheDocument()

    unmount()

    rerender(
      withAppContext(
        <IncidentDetail incident={defaultIncident} onBack={jest.fn()} />
      )
    )

    expect(
      screen.queryByRole('link', { name: 'Standaardmelding 4321' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Deelmelding 4321' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Hoofdmelding 4321' })
    ).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <IncidentDetail incident={partialIncident} onBack={jest.fn()} />
      )
    )

    expect(
      screen.queryByRole('link', { name: 'Standaardmelding 5678' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Deelmelding 5678' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Hoofdmelding 5678' })
    ).not.toBeInTheDocument()
  })
})
