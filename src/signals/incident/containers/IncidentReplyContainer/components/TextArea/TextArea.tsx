import { FunctionComponent, useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import TextAreaComponent from 'components/TextArea'
import { FieldProps } from '../../types'

const DEFAULT_MAX_LENGTH = 1000
const DEFAULT_ROWS = 6

const TextArea: FunctionComponent<FieldProps> = ({
  errorMessage,
  label,
  id,
  control,
  register,
}) => {
  const value = useWatch({
    control,
    name: id,
    defaultValue: '',
  })

  const infoText = useMemo(
    () => `${value.length}/${DEFAULT_MAX_LENGTH} tekens`,
    [value]
  )

  const labelComponent = <strong>{label}</strong>

  return (
    <TextAreaComponent
      ref={register({
        required: {
          message: 'Dit is een verplicht veld',
          value: true,
        },
        maxLength: {
          message: `U heeft meer dan de maximale ${DEFAULT_MAX_LENGTH} tekens ingevoerd`,
          value: DEFAULT_MAX_LENGTH,
        },
      })}
      errorMessage={errorMessage}
      name={id}
      id={id}
      infoText={infoText}
      label={labelComponent}
      rows={DEFAULT_ROWS}
    />
  )
}

export default TextArea
