import { useState, useCallback } from 'react'
import { Questionnaire } from 'types/api/qa/questionnaire'
import { FieldType, Question } from 'types/api/qa/question'
import TextArea from 'components/TextArea'
import { Button } from '@amsterdam/asc-ui'

interface FieldProps {
  data: Question
  onChange: (value: any) => void
  required: boolean
  error: boolean
  errorMessage?: string
  value: any
}

const PlainTextQuestion = ({
  data,
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
      label={<strong>{data.label}</strong>}
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
  [FieldType.Submit]: () => <></>,
}

interface Props {
  onSubmit: (state: { uuid: string; value: any }[]) => void
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

const QuestionnaireComponent = ({ questionnaire, onSubmit }: Props) => {
  const [state, setState] = useState<State>(
    createState([questionnaire.first_question])
  )

  const submit = useCallback(() => {
    const answers = Object.entries(state).map(([uuid, { value }]) => ({
      uuid,
      value,
    }))

    onSubmit(answers)
  }, [state, onSubmit])

  const updateValue = useCallback(
    (uuid: string, value: any) => {
      setState({
        ...state,
        [uuid]: { ...state[uuid], value },
      })
    },
    [state, setState]
  )

  const questions = Object.entries(state).map(([uuid, q]) => {
    const Component = componentMap[q.data.field_type]

    return (
      <Component
        key={uuid}
        data={q.data}
        onChange={(value: any) => updateValue(uuid, value)}
        required={q.data.required}
        error={q.error}
        errorMessage={q.errorMessage}
        value={q.value}
      />
    )
  })

  return (
    <>
      {questions}
      <Button
        variant="secondary"
        type="submit"
        disabled={false}
        onClick={submit}
      >
        Versturen
      </Button>
    </>
  )
}

export default QuestionnaireComponent
