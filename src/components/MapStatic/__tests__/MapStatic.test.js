// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import MapStatic from '..'
import blob from './static.jpg'

const lat = 52.37553393844094
const lng = 4.879890711122719

fetch.mockResponse(new Blob([blob], { type: 'image/png' }))

describe('components/MapStatic', () => {
  it('should render a loading message and image placeholder', async () => {
    const { queryByTestId, findByTestId } = render(
      withAppContext(<MapStatic lat={lat} lng={lng} />)
    )

    expect(queryByTestId('mapStaticLoadingMessage')).toBeInTheDocument()
    expect(queryByTestId('mapStaticPlaceholder')).toBeInTheDocument()

    await findByTestId('mapStatic')

    expect(queryByTestId('mapStaticLoadingMessage')).not.toBeInTheDocument()
  })

  it('should not render a loading message', async () => {
    const { queryByTestId, findByTestId } = render(
      withAppContext(
        <MapStatic lat={lat} lng={lng} showLoadingMessage={false} />
      )
    )

    expect(queryByTestId('mapStaticLoadingMessage')).not.toBeInTheDocument()

    await findByTestId('mapStatic')

    expect(queryByTestId('mapStaticLoadingMessage')).not.toBeInTheDocument()
  })

  it('should render an error message', async () => {
    const error = new Error()
    fetch.mockRejectOnce(error)

    const { queryByTestId, findByTestId } = render(
      withAppContext(<MapStatic lat={lat} lng={lng} />)
    )

    expect(queryByTestId('mapStaticError')).not.toBeInTheDocument()

    await findByTestId('mapStatic')

    expect(queryByTestId('mapStaticError')).toBeInTheDocument()
  })

  it('should render a static map image', async () => {
    const { queryByTestId, findByTestId } = render(
      withAppContext(<MapStatic lat={lat} lng={lng} />)
    )

    expect(queryByTestId('mapStaticMap')).not.toBeInTheDocument()

    await findByTestId('mapStatic')

    expect(queryByTestId('mapStaticImage')).toBeInTheDocument()
  })

  it('should render a marker', async () => {
    const { queryByTestId, findByTestId, rerender } = render(
      withAppContext(<MapStatic lat={lat} lng={lng} />)
    )

    await findByTestId('mapStatic')

    expect(queryByTestId('mapStaticMarker')).toBeInTheDocument()

    rerender(
      withAppContext(<MapStatic lat={lat} lng={lng} showMarker={false} />)
    )

    await findByTestId('mapStatic')

    expect(queryByTestId('mapStaticMarker')).not.toBeInTheDocument()
  })

  it('should request different formats', async () => {
    const { findByTestId, unmount } = render(
      withAppContext(<MapStatic lat={lat} lng={lng} />)
    )

    await findByTestId('mapStatic')

    expect(fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('format=jpeg'),
      expect.objectContaining({ responseType: 'blob' })
    )

    unmount()

    render(withAppContext(<MapStatic lat={lat} lng={lng} format="gif" />))

    await findByTestId('mapStatic')

    expect(fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('format=gif'),
      expect.objectContaining({ responseType: 'blob' })
    )
  })

  it('should request a specific image size', async () => {
    const width = 1000
    const height = 500

    const { findByTestId } = render(
      withAppContext(
        <MapStatic lat={lat} lng={lng} width={width} height={height} />
      )
    )

    await findByTestId('mapStatic')

    const re = new RegExp(`width=${width}|height=${height}`)

    expect(fetch).toHaveBeenLastCalledWith(
      expect.stringMatching(re),
      expect.objectContaining({ responseType: 'blob' })
    )
  })

  it('should request specific map layers', async () => {
    const layers = 'basiskaart-light'

    const { findByTestId, unmount } = render(
      withAppContext(<MapStatic lat={lat} lng={lng} />)
    )

    await findByTestId('mapStatic')

    expect(fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('layers=basiskaart'),
      expect.objectContaining({ responseType: 'blob' })
    )

    unmount()

    render(withAppContext(<MapStatic lat={lat} lng={lng} layers={layers} />))

    await findByTestId('mapStatic')

    expect(fetch).toHaveBeenLastCalledWith(
      expect.stringContaining(`layers=${layers}`),
      expect.objectContaining({ responseType: 'blob' })
    )
  })
})
