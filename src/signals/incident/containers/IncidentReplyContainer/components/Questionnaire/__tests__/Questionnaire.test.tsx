// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withAppContext } from 'test/utils'
import { FieldType } from 'types/api/qa/question'
import type { Questionnaire as QuestionnaireType } from 'types/api/qa/questionnaire'
import Questionnaire from '..'

const questionnaire: QuestionnaireType = {
  uuid: '50f87d6e-2479-4358-bf59-f01c27191848',
  name: 'Reactie gevraagd',
  description: null,
  is_active: true,
  first_question: {
    key: null,
    uuid: 'bbb5518e-0044-4bc7-89dd-b16a0dfbbf07',
    label: 'Wat voor kleur heeft de auto?',
    short_label: 'Reactie melder',
    field_type: FieldType.PlainText,
    next_rules: null,
    required: true,
  },
}

const submitSpy = jest.fn()

describe('<Questionnaire />', () => {
  it('should render the questionnaire component', () => {
    render(
      withAppContext(
        <Questionnaire questionnaire={questionnaire} onSubmit={submitSpy} />
      )
    )

    screen.getByRole('textbox', { name: 'Wat voor kleur heeft de auto?' })
    screen.getByLabelText(/Foto's toevoegen/)
    screen.getByRole('button', { name: 'Verstuur' })
  })

  it('should submit the correct values', async () => {
    const value = 'rood'
    const expected = [
      {
        fieldType: questionnaire.first_question.field_type,
        uuid: questionnaire.first_question.uuid,
        value,
      },
      { fieldType: 'file_input', uuid: 'file-input', value: [] },
    ]

    render(
      withAppContext(
        <Questionnaire questionnaire={questionnaire} onSubmit={submitSpy} />
      )
    )

    userEvent.type(
      screen.getByRole('textbox', { name: 'Wat voor kleur heeft de auto?' }),
      value
    )
    userEvent.click(screen.getByRole('button', { name: 'Verstuur' }))

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith(expected)
    })
  })
})
