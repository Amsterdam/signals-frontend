// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { screen, render, fireEvent } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import type { DefaultText as DefaultTextType } from 'types/api/default-text'
import { StatusCode } from 'types/status-code'

import DefaultTexts from '.'
import type { DefaulTextsProps } from './DefaultTexts'

describe('<DefaultTexts />', () => {
  let props: DefaulTextsProps

  beforeEach(() => {
    props = {
      status: StatusCode.Afgehandeld,
      onClose: jest.fn(),
      defaultTexts: [
        {
          state: StatusCode.Afgehandeld,
          templates: [
            {
              title: 'Titel 1',
              text: 'Er is een accu gevonden en deze is meegenomen',
              is_active: true,
            },
            {
              title: '222',
              text: 'sdfsdfsdf',
              is_active: true,
            },
            {
              title: 'Asbest',
              text: 'Er is asbest gevonden en dit zal binnen 3 werkdagen worden opgeruimd.',
              is_active: true,
            },
          ],
        },
      ],
      onHandleUseDefaultText: jest.fn(),
    }
  })

  it('should render correctly', () => {
    const { queryAllByTestId } = render(
      withAppContext(<DefaultTexts {...props} />)
    )

    expect(screen.getByTestId('modal-title')).toHaveTextContent(
      /^Standaardtekst$/
    )

    expect(queryAllByTestId('default-texts-item-text')).toHaveLength(3)
    expect(queryAllByTestId('default-texts-item-title')[0]).toHaveTextContent(
      /^Titel 1$/
    )
    expect(queryAllByTestId('default-texts-item-text')[0]).toHaveTextContent(
      /^Er is een accu gevonden en deze is meegenomen$/
    )
    expect(queryAllByTestId('default-texts-item-title')[1]).toHaveTextContent(
      /^222$/
    )
    expect(queryAllByTestId('default-texts-item-text')[1]).toHaveTextContent(
      /^sdfsdfsdf$/
    )
    expect(queryAllByTestId('default-texts-item-title')[2]).toHaveTextContent(
      /^Asbest$/
    )
    expect(queryAllByTestId('default-texts-item-text')[2]).toHaveTextContent(
      /^Er is asbest gevonden en dit zal binnen 3 werkdagen worden opgeruimd\.$/
    )
  })

  it('should not render when wrong status is used', () => {
    const { queryAllByTestId } = render(
      withAppContext(<DefaultTexts {...props} status={StatusCode.Ingepland} />)
    )

    expect(queryAllByTestId('default-texts-item-text')).toHaveLength(0)
  })

  it('should not render when list is empty', () => {
    const defaultTexts: Array<DefaultTextType> = []

    const { queryAllByTestId } = render(
      withAppContext(<DefaultTexts {...props} defaultTexts={defaultTexts} />)
    )

    expect(queryAllByTestId('default-texts-item-text')).toHaveLength(0)
  })

  it('should render notification when list has no templates', () => {
    const defaultTexts = [...props.defaultTexts]
    defaultTexts[0].templates = []

    const { getByText } = render(
      withAppContext(<DefaultTexts {...props} defaultTexts={defaultTexts} />)
    )

    expect(
      getByText(
        'Er is geen standaard tekst voor deze subcategorie en status combinatie.'
      )
    ).toBeInTheDocument()
  })

  it('should call the callback function when button clicked', () => {
    const { queryAllByTestId } = render(
      withAppContext(<DefaultTexts {...props} />)
    )
    fireEvent.click(queryAllByTestId('default-texts-item-button')[0])

    expect(props.onHandleUseDefaultText).toHaveBeenCalledTimes(1)
  })
})
