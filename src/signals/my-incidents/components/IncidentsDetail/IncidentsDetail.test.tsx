/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { IncidentsDetail } from './IncidentsDetail'
import { withAppContext } from '../../../../test/utils'
import { incidentsDetail } from '../../__test__/incidents-detail'

const setShowMap = jest.fn()

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'http://www.mijnmeldingen.nl/mijn-meldingen/123/123',
  }),
}))

describe('IncidentsDetail', () => {
  it('should render correctly', () => {
    const { container, rerender } = render(
      withAppContext(
        <IncidentsDetail
          incidentsDetail={incidentsDetail}
          setShowMap={setShowMap}
          token={'123'}
        />
      )
    )

    expect(
      screen.getByRole('link', { name: 'Mijn meldingen' })
    ).toBeInTheDocument()

    expect(screen.getByText('Meldingsnummer: SIG-11656')).toBeInTheDocument()

    expect(screen.getByText('Omschrijving')).toBeInTheDocument()

    expect(screen.getByText('Foto')).toBeInTheDocument()

    expect(container.querySelector('img')).toBeInTheDocument()

    expect(screen.getByText('Locatie')).toBeInTheDocument()

    expect(screen.getByText('Bekijk op kaart')).toBeInTheDocument()

    expect(screen.getByText('Momenten')).toBeInTheDocument()

    expect(
      screen.getByText('heel erg vaak en het is heel erg stom')
    ).toBeInTheDocument()

    const attachment = incidentsDetail._links['sia:attachments']
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    incidentsDetail._links['sia:attachments'] = [...attachment, ...attachment]

    rerender(
      withAppContext(
        <IncidentsDetail
          incidentsDetail={incidentsDetail}
          setShowMap={setShowMap}
          token={'123'}
        />
      )
    )

    expect(screen.getByText("Foto's")).toBeInTheDocument()
  })

  it('should hide img and gebeurt het vaker if props are missing', function () {
    const { container } = render(
      withAppContext(
        <IncidentsDetail
          incidentsDetail={{
            ...incidentsDetail,
            extra_properties: [],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _links: [],
          }}
          setShowMap={setShowMap}
          token={'123'}
        />
      )
    )

    expect(screen.queryByText('Foto')).not.toBeInTheDocument()

    expect(container.querySelector('img')).not.toBeInTheDocument()
  })

  it('renders attachment viewer', () => {
    const { container } = render(
      withAppContext(
        <IncidentsDetail
          incidentsDetail={incidentsDetail}
          setShowMap={setShowMap}
          token={'123'}
        />
      )
    )

    const image = container.querySelector('img') as HTMLElement

    expect(image).toBeInTheDocument()
    expect(
      screen.queryByTestId('attachment-viewer-image')
    ).not.toBeInTheDocument()

    userEvent.click(image)

    expect(screen.queryByTestId('attachment-viewer-image')).toBeInTheDocument()
  })

  it('closes previews when close button is clicked', async () => {
    const { container } = render(
      withAppContext(
        <IncidentsDetail
          incidentsDetail={incidentsDetail}
          setShowMap={setShowMap}
          token={'123'}
        />
      )
    )

    const image = container.querySelector('img') as HTMLElement

    expect(image).toBeInTheDocument()

    expect(
      screen.queryByTestId('attachment-viewer-image')
    ).not.toBeInTheDocument()
    expect(screen.queryByTitle(/sluiten/i)).not.toBeInTheDocument()

    userEvent.click(image)

    await waitFor(() => {
      expect(
        screen.queryByTestId('attachment-viewer-image')
      ).toBeInTheDocument()
    })

    const closeButton = screen.getByTitle(/sluiten/i)
    expect(closeButton).toBeInTheDocument()

    userEvent.click(closeButton)

    expect(
      screen.queryByTestId('attachment-viewer-image')
    ).not.toBeInTheDocument()
    expect(screen.queryByTitle(/sluiten/i)).not.toBeInTheDocument()
  })
})
