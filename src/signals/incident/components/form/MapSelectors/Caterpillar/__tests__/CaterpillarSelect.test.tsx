// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import incidentJson from 'utils/__tests__/fixtures/incident.json'
import { withAppContext } from 'test/utils'
import type { Location } from 'types/incident'
import type { CaterpillarSelectProps } from '../CaterpillarSelect'
import CaterpillarSelect from '..'
import { initialValue } from '../context/context'
import { withSelectContext } from '../context/__tests__/context.test'

// prevent fetch requests that we don't need to verify
jest.mock('../WfsLayer', () => () => <span data-testid="wfsLayer" />)

describe('CaterpillarSelect', () => {
  let props: CaterpillarSelectProps
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
    render(withAppContext(<CaterpillarSelect {...props} />))

    expect(screen.queryByTestId('selectIntro')).toBeInTheDocument()
    expect(
      screen.queryByTestId('caterpillarSelectSelector')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('caterpillarSelectSummary')
    ).not.toBeInTheDocument()
  })

  it('should render the Selector', () => {
    render(withSelectContext(<CaterpillarSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))
    expect(screen.queryByTestId('selectIntro')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('caterpillarSelectSelector')
    ).toBeInTheDocument()
  })

  it('should close the selector component', () => {
    render(withSelectContext(<CaterpillarSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))
    expect(
      screen.queryByTestId('caterpillarSelectSelector')
    ).toBeInTheDocument()

    userEvent.click(screen.getByTestId('mapCloseButton'))
    expect(
      screen.queryByTestId('caterpillarSelectSelector')
    ).not.toBeInTheDocument()
  })

  it('should render the Summary', () => {
    render(
      withAppContext(
        <CaterpillarSelect
          {...{
            ...props,
            handler: () => ({
              value: [
                {
                  id: 'REE01013',
                  type: 'Eikenboom',
                  description: 'Eikenboom',
                  iconUrl: '',
                },
              ],
            }),
          }}
        />
      )
    )

    expect(screen.queryByTestId('selectIntro')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('caterpillarSelectSelector')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('caterpillarSelectSummary')).toBeInTheDocument()
  })
})
