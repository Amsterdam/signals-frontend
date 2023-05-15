// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'

import { withAppContext } from 'test/utils'

import type { Props } from './CategoryForm'
import { CategoryForm } from './CategoryForm'
import type { CategoryFormValues } from '../types'

const mockFormValues = {
  description:
    'Dit is het verhaal van de brug die helemaal niet moest afwateren',
  handling_message:
    'Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail.',
  is_active: 'true',
  is_public_accessible: true,
  name: 'Afwatering brug',
  public_name: 'slagbomen',
  note: 'Test notes',
  n_days: 3,
  use_calendar_days: 1,
  show_children_in_filter: true,
}

const defaultProps: Omit<Props, 'formMethods'> = {
  formValues: mockFormValues,
  history: [
    {
      identifier: 'UPDATED_CATEGORY_217043',
      when: '2023-04-13T08:40:43.594499+02:00',
      what: 'UPDATED_CATEGORY',
      action: 'Status gewijzigd naar:\n Actief',
      description: null,
      who: 'v.de.graaf@amsterdam.nl',
    },
    {
      identifier: 'UPDATED_CATEGORY_217042',
      when: '2023-04-13T08:40:38.861113+02:00',
      what: 'UPDATED_CATEGORY',
      action: 'Status gewijzigd naar:\n Inactief',
      description: null,
      who: 'v.de.graaf@amsterdam.nl',
    },
  ],
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  readOnly: false,
  responsibleDepartments: ['VOR', 'STW'],
  isMainCategory: false,
  isPublicAccessibleLabel:
    'Toon meldingen van deze subcategorie op openbare kaarten en op de kaart in het meldformulier.',
}

const Wrapper = (props: Partial<Props>) => {
  const methods = useForm<CategoryFormValues>()
  return withAppContext(
    <CategoryForm {...defaultProps} formMethods={methods} {...props} />
  )
}

describe('CategoryForm', () => {
  it('should render correct fields when subcategory', () => {
    render(<Wrapper />)

    expect(screen.getByRole('textbox', { name: 'Naam' })).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Omschrijving' })
    ).toBeInTheDocument()
    expect(screen.getByText('Verantwoordelijke afdeling')).toBeInTheDocument()
    expect(screen.getByText('Openbaar tonen')).toBeInTheDocument()
    expect(screen.getByText('Afhandeltermijn')).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Servicebelofte' })
    ).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Notitie' })).toBeInTheDocument()
    expect(screen.getByText('Geschiedenis')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annuleer' })).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: 'Toon meldingen van deze subcategorie op openbare kaarten en op de kaart in het meldformulier.',
      })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('checkbox', {
        name: 'Toon alle subcategorieën in het filter op de meldingenkaart die openbaar getoond mogen worden',
      })
    ).not.toBeInTheDocument()
  })

  it('should render correct fields when main category', () => {
    render(<Wrapper isMainCategory={true} />)

    expect(screen.getByText('Afwatering brug')).toBeInTheDocument()
    expect(screen.getByText('Verantwoordelijke afdeling')).toBeInTheDocument()
    expect(screen.getByText('Openbaar tonen')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Notitie' })).toBeInTheDocument()
    expect(screen.getByText('Geschiedenis')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: 'Toon alle subcategorieën in het filter op de meldingenkaart die openbaar getoond mogen worden',
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Naam openbaar')).toBeInTheDocument()

    expect(
      screen.queryByRole('checkbox', {
        name: 'Toon meldingen van deze subcategorie op openbare kaarten en op de kaart in het meldformulier.',
      })
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Afhandeltermijn')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('textbox', { name: 'Naam' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('textbox', { name: 'Omschrijving' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('textbox', { name: 'Servicebelofte' })
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Status')).not.toBeInTheDocument()
  })

  it('should not render resposible departments when not there', () => {
    render(<Wrapper responsibleDepartments={[]} />)

    expect(
      screen.queryByText('Verantwoordelijke afdeling')
    ).not.toBeInTheDocument()
  })

  it('should not be able to change public name when is_public_accessible', () => {
    const mockFormValuesNotAccessible = {
      ...mockFormValues,
      is_public_accessible: false,
    }

    render(<Wrapper formValues={mockFormValuesNotAccessible} />)

    expect(screen.queryByText('Naam openbaar')).not.toBeInTheDocument()
  })

  it('should hide buttons when readOnly', () => {
    render(<Wrapper readOnly />)

    expect(
      screen.queryByRole('button', { name: 'Annuleer' })
    ).not.toBeInTheDocument()
  })
})
