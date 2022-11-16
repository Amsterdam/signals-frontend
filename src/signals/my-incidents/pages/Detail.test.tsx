import { render, screen } from '@testing-library/react'

import useFetch from '../../../hooks/useFetch'
import { withAppContext } from '../../../test/utils'
import { get, useFetchResponse } from '../../IncidentMap/components/__test__'
import { providerMock } from '../__test__'
import { incidentsDetail } from '../__test__/incidents-detail'
import { MyIncidentsProvider } from '../context'
import { Detail } from './Detail'

jest.mock('../hooks', () => {
  const actual = jest.requireActual('../hooks')
  return {
    __esModule: true,
    ...actual,
    usePostEmail: () => [jest.fn(), 'rest'],
  }
})

jest.mock('hooks/useFetch')

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'http://www.mijnmeldingen.nl/mijn-meldingen/123/123',
  }),
}))

describe('Detail', () => {
  beforeEach(() => {
    get.mockReset()
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
  })

  it('should render correctly', () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      data: incidentsDetail,
    }))

    const { container } = render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <Detail />
        </MyIncidentsProvider>
      )
    )

    expect(screen.getByText('Mijn Meldingen: SIG-11656')).toBeInTheDocument()

    expect(screen.getByText('Omschrijving')).toBeInTheDocument()

    expect(screen.getByText('Foto')).toBeInTheDocument()

    expect(container.querySelector('img')).toBeInTheDocument()

    expect(screen.getByText('Locatie')).toBeInTheDocument()

    expect(screen.getByText('Gebeurt het vaker?')).toBeInTheDocument()
  })

  it('should hide img and extra properties', () => {
    const dataWithoutImgAndExtraProps = {
      ...incidentsDetail,
      _links: [],
      extra_properties: [],
    }

    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      data: dataWithoutImgAndExtraProps,
    }))

    const { container } = render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <Detail />
        </MyIncidentsProvider>
      )
    )

    expect(screen.queryByText('Foto')).not.toBeInTheDocument()

    expect(container.querySelector('img')).not.toBeInTheDocument()

    expect(screen.queryByText('Gebeurt het vaker?')).not.toBeInTheDocument()
  })
})
