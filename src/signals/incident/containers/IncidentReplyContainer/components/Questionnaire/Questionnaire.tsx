import { FunctionComponent } from 'react'
import { Questionnaire } from 'types/api/qa/questionnaire'

import { themeSpacing } from '@amsterdam/asc-ui'
import { useForm } from 'react-hook-form'
import { FieldType, Question } from 'types/api/qa/question'
import styled from 'styled-components'
import FileInput from '../FileInput'
import TextArea from '../TextArea'
import { FormData } from '../../types'
import Submit from './Submit'

const QuestionsWrapper = styled.div`
  > *:not(:last-child) {
    margin-bottom: ${themeSpacing(4)};
  }
`

const componentMap: Record<FieldType, (props: any) => any> = {
  [FieldType.PlainText]: TextArea,
  [FieldType.FileInput]: FileInput,
  [FieldType.Submit]: Submit,
}

interface QuestionnaireProps {
  onSubmit: (state: { uuid: string; value: unknown }[]) => void
  questionnaire: Questionnaire
}

const Questionnaire: FunctionComponent<QuestionnaireProps> = ({
  questionnaire,
  onSubmit,
}) => {
  const { register, handleSubmit, errors, control, trigger } =
    useForm<FormData>()

  const submitForm = (data: FormData) => {
    onSubmit(Object.keys(data).map((key) => ({ uuid: key, value: data[key] })))
  }

  const questionnaireQuestions = [
    questionnaire.first_question,
    {
      field_type: FieldType.FileInput,
      uuid: 'file-input',
      label: "Foto's toevoegen",
    } as Question,
    { field_type: FieldType.Submit } as Question,
  ]

  const questions = questionnaireQuestions.map((question) => {
    const Component = componentMap[question.field_type]
    if (FieldType.Submit === question.field_type) {
      return <Component key={question.field_type} name={question.field_type} />
    }

    // Control can be used with useController? and register with control.register?
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
    </form>
  )
}

export default Questionnaire
