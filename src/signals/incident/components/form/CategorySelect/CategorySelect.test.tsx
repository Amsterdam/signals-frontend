// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as categoriesSelectors from 'models/categories/selectors'
import type { WizardSection } from 'signals/incident/definitions/wizard'
import { withAppContext } from 'test/utils'
import { subcategoriesGroupedByCategories } from 'utils/__tests__/fixtures'

import CategorySelect from './CategorySelect'
import type { Props } from './CategorySelect'
import type { IncidentContainer } from './types'

const wizard: WizardSection = {
  beschrijf: {},
  vulaan: {},
  contact: {},
  summary: {},
  opslaan: {},
  bedankt: {},
  fout: {},
}

let defaultProps: Props

describe('CategorySelect', () => {
  beforeEach(() => {
    defaultProps = {
      handler: jest.fn(() => ({
        value: 'asbest-accu',
      })),
      meta: {
        name: 'category-select',
        updateIncident: jest.fn(),
      },
      parent: {
        meta: {
          addToSelection: jest.fn(),
          getClassification: jest.fn(),
          handleSubmit: jest.fn(),
          incidentContainer: {} as IncidentContainer,
          removeFromSelection: jest.fn(),
          updateIncident: jest.fn(),
          wizard,
        },
      },
    }
    jest
      .spyOn(categoriesSelectors, 'makeSelectSubcategoriesGroupedByCategories')
      .mockImplementation(() => subcategoriesGroupedByCategories)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render select field correctly', () => {
    render(withAppContext(<CategorySelect {...defaultProps} />))

    const inputElement = screen.getByRole('combobox', {
      name: 'Typ om te zoeken',
    })

    expect(inputElement).toBeInTheDocument()
    expect(screen.queryByTestId('info-text')).toBeInTheDocument()
  })

  it('should render select field with pre selected category', () => {
    render(withAppContext(<CategorySelect {...defaultProps} />))

    const inputElement = screen.getByRole('combobox', {
      name: 'Typ om te zoeken',
    })

    expect(inputElement).toHaveValue('Asbest / accu (FB, THO)')
  })

  it('should render manual selected category', () => {
    render(withAppContext(<CategorySelect {...defaultProps} />))

    const inputElement = screen.getByRole('combobox', {
      name: 'Typ om te zoeken',
    })

    expect(inputElement).toHaveValue('Asbest / accu (FB, THO)')

    userEvent.click(inputElement)
    userEvent.type(inputElement, '{ArrowDown}')
    userEvent.type(inputElement, '{enter}')

    expect(inputElement).not.toHaveValue('Asbest / accu (FB, THO)')
    expect(inputElement).toHaveValue('Afwatering brug (VOR, STW)')
  })

  it('sets incident when selecting category', async () => {
    render(withAppContext(<CategorySelect {...defaultProps} />))

    const inputElement = screen.getByRole('combobox', {
      name: 'Typ om te zoeken',
    })

    userEvent.type(inputElement, '{enter}')

    expect(defaultProps.parent.meta.updateIncident).toHaveBeenCalledWith({
      category: 'civiele-constructies',
      classification: {
        id: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies/sub_categories/afwatering-brug',
        name: 'Afwatering brug (VOR, STW)',
        slug: 'afwatering-brug',
      },
      handling_message:
        'Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail.',
      subcategory: 'afwatering-brug',
    })

    expect(defaultProps.parent.meta.updateIncident).toHaveBeenCalledTimes(1)

    expect(screen.getByTestId('info-text')).toBeInTheDocument()
  })

  it('should not update the incident when no category is found', async () => {
    render(withAppContext(<CategorySelect {...defaultProps} />))

    const inputElement = screen.getByRole('combobox', {
      name: 'Typ om te zoeken',
    })

    userEvent.click(inputElement)
    userEvent.type(inputElement, 'kaefbjhqbf')
    userEvent.type(inputElement, '{ArrowDown}')
    userEvent.type(inputElement, '{enter}')

    expect(defaultProps.parent.meta.updateIncident).not.toHaveBeenCalled()

    expect(defaultProps.parent.meta.updateIncident).toHaveBeenCalledTimes(0)
  })
})
