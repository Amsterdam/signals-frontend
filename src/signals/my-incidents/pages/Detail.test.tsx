import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

  it('should render correctly and show map', () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      data: incidentsDetail,
    }))

    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <Detail />
        </MyIncidentsProvider>
      )
    )

    userEvent.click(screen.getByText('Bekijk op kaart'))

    expect(screen.queryByTestId('mapDetail')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('closeButton'))

    expect(screen.getByText('Bekijk op kaart')).toBeInTheDocument()
  })
})
