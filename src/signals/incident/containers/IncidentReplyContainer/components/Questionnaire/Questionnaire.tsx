import { useState } from 'react'
import { Questionnaire } from 'types/api/qa/questionnaire'
import { FieldType, Question } from 'types/api/qa/question'
import TextArea from 'components/TextArea'

interface FieldProps {
  onChange: (value: any) => void
  required: boolean
  error: boolean
  errorMessage?: string
  value: any
}

const PlainTextQuestion = ({
  onChange,
  required,
  error,
  errorMessage,
  value,
}: FieldProps) => {
  const infoText = `${value.length}/1000 tekens`
  return (
    <TextArea
      data-testid="plain-text"
      error={error}
      errorMessage={errorMessage}
      infoText={infoText}
      name="text"
      onChange={(e) => onChange(e.target.value)}
      required={required}
      rows={9}
      value={value}
    />
  )
}

const createState = (questions: Question[]): State => {
  return questions.reduce((state, question) => {
    return {
      ...state,
      [question.uuid]: {
        data: question,
        value: '',
        error: false,
      },
    }
  }, {})
}

const componentMap: Record<FieldType, (props: FieldProps) => JSX.Element> = {
  [FieldType.PlainText]: PlainTextQuestion,
  [FieldType.Integer]: () => <></>,
}

interface Props {
  onSubmit: () => void
  questionnaire: Questionnaire
}

interface QuestionState {
  data: Question
  value: any
  error: boolean
  errorMessage?: string
}

interface State {
  [uuid: string]: QuestionState
}

const QuestionnaireComponent = ({ questionnaire }: Props) => {
  const [state, setState] = useState<State>(
    createState([questionnaire.first_question])
  )

  const updateValue = (uuid: string, value: any) => {
    setState({
      ...state,
      [uuid]: { ...state[uuid], value },
    })
  }

  const questions = Object.entries(state).map(([uuid, q]) => {
    const Component = componentMap[q.data.field_type]

    return (
      <>
        <Component
          key={uuid}
          onChange={(value: any) => updateValue(uuid, value)}
          required={q.data.required}
          error={q.error}
          errorMessage={q.errorMessage}
          value={q.value}
        />
      </>
    )
  })

  return (
    <>
      <strong>hi there</strong>
      {questions}
    </>
  )
}

export default QuestionnaireComponent
