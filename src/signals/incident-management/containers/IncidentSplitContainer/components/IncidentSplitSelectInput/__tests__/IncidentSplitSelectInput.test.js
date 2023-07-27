// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import priorityList from 'signals/incident-management/definitions/priorityList'
import { withAppContext } from 'test/utils'

import IncidentSplitSelectInput from '..'
import subcategoriesFixture from '../../../__tests__/subcategoriesFixture.json'

describe('IncidentSplitSelectInput', () => {
  const props = {
    name: 'subcategory',
    display: 'Subcategorie',
    id: 'subcategory',
    initialValue: subcategoriesFixture[0].key,
    options: subcategoriesFixture,
    onChange: jest.fn(),
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render a select input element', () => {
    render(withAppContext(<IncidentSplitSelectInput {...props} />))

    expect(screen.getAllByRole('option')).toHaveLength(priorityList.length + 1)
  })

  it('should select options and display info text when available', async () => {
    const { key: emptyDescriptionKey } = subcategoriesFixture[0]
    const { key, description } = subcategoriesFixture[1]
    render(withAppContext(<IncidentSplitSelectInput {...props} />))

    const descriptionTextRegex = new RegExp(description)

    userEvent.selectOptions(
      screen.getByTestId('subcategory'),
      emptyDescriptionKey
    )

    fireEvent.blur(screen.getByTestId('subcategory'))
    expect(screen.queryByText(descriptionTextRegex)).not.toBeInTheDocument()

    userEvent.selectOptions(screen.getByTestId('subcategory'), key)

    expect(await screen.findByText(descriptionTextRegex)).toBeInTheDocument()
  })

  it('calls onChange', () => {
    const { key } = subcategoriesFixture[1]

    render(withAppContext(<IncidentSplitSelectInput {...props} />))

    expect(props.onChange).not.toHaveBeenCalled()

    userEvent.selectOptions(screen.getByTestId('subcategory'), key)

    expect(props.onChange).toHaveBeenCalledTimes(1)
  })

  it('should select the initial value when nothing is selected manually', () => {
    render(withAppContext(<IncidentSplitSelectInput {...props} />))

    expect(screen.getByTestId('selectedValue')).toHaveTextContent(
      subcategoriesFixture[0].name
    )
  })
})
