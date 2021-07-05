// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fireEvent, render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import Intro from '../Intro'

const props = {
  edit: jest.fn(),
  location: [0, 0] as [number, number],
}

describe('signals/incident/components/form/Select/Intro', () => {
  beforeEach(() => {})

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component without the map', () => {
    render(withAppContext(<Intro {...props} />))

    expect(screen.getByTestId('selectIntro')).toBeInTheDocument()
    expect(screen.queryByTestId('mapLocation')).not.toBeInTheDocument()
    expect(screen.getByTestId('chooseOnMap')).toBeInTheDocument()
  })

  it('should render the component with the map', () => {
    render(withAppContext(<Intro {...props} location={[1, 1]} />))

    expect(screen.getByTestId('selectIntro')).toBeInTheDocument()
    expect(screen.getByTestId('mapLocation')).toBeInTheDocument()
    expect(screen.getByTestId('chooseOnMap')).toBeInTheDocument()
  })

  it('should call edit', () => {
    render(withAppContext(<Intro {...props} />))
    expect(props.edit).not.toHaveBeenCalled()

    const element = screen.getByTestId('chooseOnMap')
    fireEvent.click(element)
    expect(props.edit).toHaveBeenCalled()
  })
})
