// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'
import type { Question } from 'types/api/qa/question'
import { FieldType } from 'types/api/qa/question'

import Questionnaire from '..'
import { ALLOWED_FILE_TYPES, MIN } from '../../FileInput/FileInput'

const questions: Question[] = [
  {
    key: null,
    uuid: 'foo',
    label: 'Wat voor kleur heeft de auto?',
    short_label: 'Reactie melder',
    field_type: FieldType.PlainText,
    next_rules: null,
    required: true,
  },
  {
    key: null,
    uuid: 'bar',
    label: "Voeg aub wat foto's toe",
    short_label: "Foto's toevoegen",
    field_type: FieldType.FileInput,
    next_rules: null,
    required: true,
  },
]

const submitSpy = jest.fn()

describe('<Questionnaire />', () => {
  it('should render the questionnaire component', () => {
    render(
      withAppContext(
        <Questionnaire questions={questions} onSubmit={submitSpy} />
      )
    )

    screen.getByRole('textbox', { name: 'Wat voor kleur heeft de auto?' })
    screen.getByLabelText(/Foto's toevoegen/)
    screen.getByRole('button', { name: 'Verstuur' })
  })

  it('should submit plaintext and file input values', async () => {
    const plainTextValue = 'rood'
    const fileValue = new File(['X'.repeat(MIN + 1)], 'hello.png', {
      type: ALLOWED_FILE_TYPES[0],
    })
    const expected = [
      {
        fieldType: questions[0].field_type,
        uuid: questions[0].uuid,
        value: plainTextValue,
      },
      {
        fieldType: questions[1].field_type,
        uuid: questions[1].uuid,
        value: [fileValue],
      },
    ]

    render(
      withAppContext(
        <Questionnaire questions={questions} onSubmit={submitSpy} />
      )
    )

    userEvent.type(
      screen.getByRole('textbox', { name: 'Wat voor kleur heeft de auto?' }),
      plainTextValue
    )
    userEvent.upload(screen.getByLabelText(/Foto's toevoegen/), fileValue)
    userEvent.click(screen.getByRole('button', { name: 'Verstuur' }))

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith(expected)
    })
  })
})
