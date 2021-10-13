// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import incidentJson from 'utils/__tests__/fixtures/incident.json'
import { withAppContext } from 'test/utils'
import type { Location } from 'types/incident'
import type { AssetSelectProps } from '../AssetSelect'
import AssetSelect from '..'
import { initialValue } from '../context'
import { withAssetSelectContext } from './context.test'

// prevent fetch requests that we don't need to verify
jest.mock('../Selector/WfsLayer', () => () => <span data-testid="wfsLayer" />)

describe('AssetSelect', () => {
  let props: AssetSelectProps
  const updateIncident = jest.fn()
  const location = incidentJson.location as Location
  beforeEach(() => {
    props = {
      handler: () => ({
        value: [],
      }),
      meta: initialValue.meta,
      parent: {
        meta: {
          incidentContainer: { incident: { location } },
          updateIncident,
        },
      },
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the Intro', () => {
    render(withAppContext(<AssetSelect {...props} />))

    expect(screen.queryByTestId('assetSelectIntro')).toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSummary')).not.toBeInTheDocument()
  })

  it('should render the Selector', () => {
    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))
    expect(screen.queryByTestId('assetSelectIntro')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSelector')).toBeInTheDocument()
  })

  it('should close the selector component', () => {
    render(withAssetSelectContext(<AssetSelect {...props} />))

    act(() => {
      userEvent.click(screen.getByText(/kies op kaart/i))
    })
    expect(screen.queryByTestId('assetSelectSelector')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('mapCloseButton'))
    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
  })

  it('should render the Summary', () => {
    render(
      withAppContext(
        <AssetSelect
          {...{
            ...props,
            handler: () => ({
              value: [
                {
                  id: 'PL734',
                  type: 'plastic',
                  description: 'Plastic asset',
                  iconUrl: '',
                },
              ],
            }),
          }}
        />
      )
    )

    expect(screen.queryByTestId('assetSelectIntro')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSummary')).toBeInTheDocument()
  })
})
