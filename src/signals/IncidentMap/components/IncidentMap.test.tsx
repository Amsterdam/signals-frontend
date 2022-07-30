// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import fetchMock from 'jest-fetch-mock'
import { render, act, screen } from '@testing-library/react'

import type configurationType from 'shared/services/configuration/__mocks__/configuration'
import configuration from 'shared/services/configuration/configuration'
import { withMapContext } from 'test/utils'
import geographyJSON from 'utils/__tests__/fixtures/geography.json'
//
// import * as reactRedux from "react-redux";
// import withAssetSelectContext from "../../incident/components/form/MapSelectors/Asset/__tests__/withAssetSelectContext";
// import DetailPanel from "../../incident/components/form/MapSelectors/Asset/Selector/DetailPanel";
// import type {AssetSelectValue} from "../../incident/components/form/MapSelectors/Asset/types";
// import type {
//   DetailPanelProps
// } from "../../incident/components/form/MapSelectors/Asset/Selector/DetailPanel/DetailPanel";
import IncidentMap, { POLLING_INTERVAL } from './IncidentMap'
// import MockInstance = jest.MockInstance

const mockConfiguration = configuration as typeof configurationType
const createdAfter = '1999-01-01T00:00:00'
const createdBefore = '1999-01-05T00:00:00'

let mockFilterParams: { created_after: string; created_before: string }

jest.mock('shared/services/configuration/configuration')
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('signals/incident-management/selectors', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ...jest.requireActual('signals/incident-management/selectors')!,
  makeSelectFilterParams: () => mockFilterParams,
}))

// const dispatch = jest.fn()

describe('IncidentMap', () => {
  beforeEach(() => {
    fetchMock.mockResponse(JSON.stringify(geographyJSON))

    mockFilterParams = {
      created_after: createdAfter,
      created_before: createdBefore,
    }
  })

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    mockConfiguration.__reset()
    fetchMock.resetMocks()
  })

  it('should render the map and the detailpanel', async () => {
    render(withMapContext(<IncidentMap hideButtons={true} />))

    await screen.findByTestId('incidentMap')

    expect(screen.getByText('Zoek naar adres of postcode')).toBeInTheDocument()
  })

  it('renders the map without results for the past period', async () => {
    // API will return a result, but with 'null' for the 'features' prop
    fetchMock.mockResponse(
      JSON.stringify({
        type: 'FeatureCollection',
        features: null,
      })
    )

    render(withMapContext(<IncidentMap hideButtons={true} />))

    await screen.findByTestId('incidentMap')

    expect(screen.getByText('Zoek naar adres of postcode')).toBeInTheDocument()
  })

  // describe('DetailPanel', () => {
  //
  //   const props: DetailPanelProps = {
  //     hideLegendButton: true
  //   }
  //
  //
  //   beforeEach(() => {
  //     jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
  //     const dispatchEventSpy: MockInstance<any, any> = jest.spyOn(
  //       global.document,
  //       'dispatchEvent'
  //     )
  //     dispatch.mockReset()
  //     dispatchEventSpy.mockReset()
  //   })
  //
  //   afterEach(() => {
  //     jest.resetAllMocks()
  //   })
  //
  //
  //   it('dispatches the location when an address is selected', async () => {
  //     const incidentMapContext: AssetSelectValue = {
  //       coordinates: undefined,
  //       message: undefined,
  //       meta: {
  //         endpoint: '',
  //         featureTypes: [],
  //         featureStatusTypes: [],
  //         extraProperties: [],
  //         maxNumberOfAssets: undefined,
  //         language: {
  //           title: ' ',
  //           subTitle: ' ',
  //           description:
  //             'Op deze kaart staan meldingen in de openbare ruimte waarmee we ' +
  //             'aan het werk zijn. Vanwege privacy staan niet alle meldingen op de kaart.',
  //         },
  //       },
  //       selection: undefined,
  //       fetchLocation: /* istanbul ignore next */ () => {
  //       },
  //       setLocation: jest.fn(),
  //       setMessage: /* istanbul ignore next */ () => {
  //       },
  //       setItem: /* istanbul ignore next */ () => {
  //       },
  //       removeItem: /* istanbul ignore next */ () => {
  //       },
  //     }
  //
  //     render(
  //       withAssetSelectContext(<DetailPanel {...props} />, {
  //         ...incidentMapContext,
  //       })
  //     )
  //
  //     expect(incidentMapContext.setLocation).not.toHaveBeenCalled()
  //
  //     fireEvent.change(screen.getByTestId('inputAddress').firstChild,
  //       {target: {value: 'Weesperstraat 3,1018DN Amsterdam'}}
  //     )
  //
  //     expect(incidentMapContext.setLocation).toHaveBeenCalled()
  //   })
  // })

  describe('request', () => {
    const reDateTime = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
    const expectedFilterParams: Record<string, RegExp> = {
      created_after: reDateTime,
      created_before: reDateTime,
      page_size: /4000/,
    }

    it('should fetch locations from endpoint', async () => {
      const { rerender, unmount } = render(withMapContext(<IncidentMap />))

      await screen.findByTestId('incidentMap')

      expect(fetchMock.mock.calls).toHaveLength(1)

      const requestUrl = new URL(fetchMock.mock.calls[0][0] as string)
      const params = new URLSearchParams(requestUrl.search)
      const endpoint = `${configuration.apiBaseUrl}${requestUrl.pathname}`

      expect(endpoint).toBe(configuration.GEOGRAPHY_ENDPOINT)

      Object.keys(expectedFilterParams).forEach((expectedKey) => {
        const paramKeys = [...params.keys()]
        expect(paramKeys.includes(expectedKey)).toBeTruthy()

        const paramKey = paramKeys.find((key) => key === expectedKey)
        expect(paramKey && params.get(paramKey)).toMatch(
          expectedFilterParams[expectedKey]
        )
      })

      expect(params.get('created_after')).toEqual(createdAfter)
      expect(params.get('created_before')).toEqual(createdBefore)

      unmount()

      rerender(withMapContext(<IncidentMap />))

      await screen.findByTestId('incidentMap')

      expect(fetchMock.mock.calls).toHaveLength(2)
    })

    it('should not poll the endpoint by default', async () => {
      jest.useFakeTimers()

      render(withMapContext(<IncidentMap />))

      await screen.findByTestId('incidentMap')

      expect(fetchMock.mock.calls).toHaveLength(1)

      act(() => {
        jest.advanceTimersByTime(POLLING_INTERVAL)
      })

      await screen.findByTestId('incidentMap')

      expect(fetchMock.mock.calls).toHaveLength(1)

      jest.useRealTimers()
    })

    it('should poll the endpoint when refresh is true', async () => {
      jest.useFakeTimers()

      render(withMapContext(<IncidentMap refresh />))

      await screen.findByTestId('incidentMap')

      expect(fetchMock.mock.calls).toHaveLength(1)

      act(() => {
        jest.advanceTimersByTime(POLLING_INTERVAL)
      })

      await screen.findByTestId('incidentMap')

      expect(fetchMock.mock.calls).toHaveLength(2)

      jest.useRealTimers()
    })
  })

  it('should overwrite date filter params with mapFilter24Hours enabled', async () => {
    configuration.featureFlags.mapFilter24Hours = true
    render(withMapContext(<IncidentMap />))

    await screen.findByTestId('incidentMap')

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string)
    const params = new URLSearchParams(requestUrl.search)

    expect(params.get('created_after')).not.toEqual(createdAfter)
    expect(params.get('created_before')).not.toEqual(createdBefore)
  })
})
