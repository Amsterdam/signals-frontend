// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { FunctionComponent } from 'react'
import { Questionnaire as QuestionnaireType } from 'types/api/qa/questionnaire'

import { themeSpacing } from '@amsterdam/asc-ui'
import { useForm } from 'react-hook-form'
import { FieldType, Question } from 'types/api/qa/question'
import styled from 'styled-components'
import FileInput from '../FileInput'
import TextArea from '../TextArea'
import { FormAnswer, FormData } from '../../types'
import Submit from '../Submit'

const QuestionsWrapper = styled.div`
  > * {
    margin-bottom: ${themeSpacing(8)};
  }
`

const componentMap: Record<FieldType, (props: any) => any> = {
  [FieldType.PlainText]: TextArea,
  [FieldType.FileInput]: FileInput,
}

interface QuestionnaireProps {
  onSubmit: (state: FormAnswer[]) => void
  questionnaire: QuestionnaireType
}

const Questionnaire: FunctionComponent<QuestionnaireProps> = ({
  questionnaire,
  onSubmit,
}) => {
  const { register, handleSubmit, errors, control, trigger } =
    useForm<FormData>()

  const questionnaireQuestions = [
    questionnaire.first_question,
    {
      field_type: FieldType.FileInput,
      uuid: 'file-input',
      label: "Foto's toevoegen",
    } as Question,
  ]

  const submitForm = (data: FormData) => {
    onSubmit(
      Object.keys(data).map((key) => ({
        uuid: key,
        value: data[key],
        fieldType: questionnaireQuestions.find(({ uuid }) => uuid == key)
          ?.field_type,
      }))
    )
  }

  const questions = questionnaireQuestions.map((question) => {
    const Component = componentMap[question.field_type]

    return (
      <Component
        control={control}
        trigger={trigger}
        register={register}
        label={question.label}
        id={question.uuid}
        errorMessage={errors[question.uuid]?.message}
        key={question.uuid}
      />
    )
  })

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <QuestionsWrapper>{questions}</QuestionsWrapper>
      <Submit />
    </form>
  )
}

export default Questionnaire
