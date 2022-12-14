// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { themeSpacing } from '@amsterdam/asc-ui'
import { useForm } from 'react-hook-form'
import type { FieldError } from 'react-hook-form'
import styled from 'styled-components'

import Button from 'components/Button'
import type { FormAnswer } from 'signals/incident/containers/IncidentReplyContainer/types'
import type { Question } from 'types/api/qa/question'
import { FieldType } from 'types/api/qa/question'

import FileInput from '../FileInput'
import TextArea from '../TextArea'

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
  questions: Question[]
}

const Questionnaire = ({ questions, onSubmit }: QuestionnaireProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
  } = useForm()

  const submitForm = (data: Record<string, FormAnswer['value']>) => {
    onSubmit(
      Object.keys(data).map((key) => ({
        uuid: key,
        value: data[key],
        fieldType: questions.find(({ uuid }) => uuid == key)?.field_type,
      }))
    )
  }

  const questionsComponent = questions.map((question) => {
    const Component = componentMap[question.field_type]

    return (
      <Component
        control={control}
        trigger={trigger}
        register={register}
        shortLabel={question.short_label}
        label={question.label}
        id={question.uuid}
        errorMessage={(errors[question.uuid] as FieldError)?.message}
        key={question.uuid}
      />
    )
  })

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <QuestionsWrapper>{questionsComponent}</QuestionsWrapper>
      <Button variant="secondary" type="submit">
        Verstuur
      </Button>
    </form>
  )
}

export default Questionnaire
