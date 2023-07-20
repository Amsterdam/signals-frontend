// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'
import type { StandardText as StandardTextType } from 'types/api/standard-texts'
import { StatusCode } from 'types/status-code'

import { StandardTexts } from './StandardTexts'
import type { Props } from './StandardTexts'

const defaultProps: Props = {
  standardTexts: [
    {
      id: 43,
      title: 'wit',
      text: 'bruin en wit',
      active: true,
      state: StatusCode.Behandeling,
      categories: [176],
      meta: {},
    },
    {
      id: 45,
      title: 'Behandeling en tot ziens',
      text: 'We hebben je melding in behandeling. Tot ziens.',
      active: true,
      state: StatusCode.Behandeling,
      categories: [176],
      meta: {},
    },
  ],
  status: StatusCode.Afgehandeld,
  onClose: jest.fn(),
  onHandleUseStandardText: jest.fn(),
}

describe('<DefaultTexts />', () => {
  it('should render correctly', () => {
    render(withAppContext(<StandardTexts {...defaultProps} />))

    expect(screen.getByTestId('modal-title')).toHaveTextContent(
      /^Standaardtekst$/
    )

    expect(screen.getByText('wit')).toBeInTheDocument()
    expect(screen.getByText('bruin en wit')).toBeInTheDocument()
    expect(screen.getByText('Behandeling en tot ziens')).toBeInTheDocument()
    expect(
      screen.getByText('We hebben je melding in behandeling. Tot ziens.')
    ).toBeInTheDocument()
    expect(screen.queryAllByText(/Gebruik deze tekst/)).toHaveLength(2)
  })

  it('should not render when list is empty', () => {
    const defaultTexts: StandardTextType[] = []

    const { queryAllByTestId } = render(
      withAppContext(
        <StandardTexts {...defaultProps} standardTexts={defaultTexts} />
      )
    )

    expect(queryAllByTestId('default-texts-item-text')).toHaveLength(0)
    expect(screen.queryByText(/Gebruik deze tekst/)).not.toBeInTheDocument()
  })

  it('should render notification when list has no templates', () => {
    const defaultTexts: StandardTextType[] = []

    render(
      withAppContext(
        <StandardTexts {...defaultProps} standardTexts={defaultTexts} />
      )
    )

    expect(
      screen.getByText(
        'Er is geen standaard tekst voor deze subcategorie en status combinatie.'
      )
    ).toBeInTheDocument()
  })

  it('should call the callback function when button clicked', () => {
    const { queryAllByTestId } = render(
      withAppContext(<StandardTexts {...defaultProps} />)
    )
    userEvent.click(queryAllByTestId('default-texts-item-button')[0])

    expect(defaultProps.onHandleUseStandardText).toHaveBeenCalledTimes(1)
  })
})
