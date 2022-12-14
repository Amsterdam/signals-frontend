// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import styled from 'styled-components'
import TextAreaComponent from 'components/TextArea'
import type { FieldProps } from '../../types'

export const DEFAULT_MAX_LENGTH = 1000
const DEFAULT_ROWS = 6
const StyledLabel = styled.strong`
  white-space: pre-wrap;
  word-break: break-word;
`

const TextArea: FunctionComponent<FieldProps> = ({
  errorMessage,
  label,
  id,
  control,
  register,
  rules,
}) => {
  const value = useWatch({
    control,
    name: id,
    defaultValue: '',
  }) as string
  const maxLength = rules?.maxLength ?? DEFAULT_MAX_LENGTH

  const infoText = useMemo(
    () => `${value.length}/${maxLength} tekens`,
    [maxLength, value.length]
  )

  const labelComponent = <StyledLabel>{label}</StyledLabel>

  return (
    <TextAreaComponent
      errorMessage={errorMessage}
      name={id}
      id={id}
      infoText={infoText}
      label={labelComponent}
      rows={DEFAULT_ROWS}
      {...register(id, {
        validate: {
          required: (value: string) => {
            if (!value.trim()) {
              return 'Dit is een verplicht veld'
            }
          },
        },
        maxLength: {
          message: `U heeft meer dan de maximale ${maxLength} tekens ingevoerd`,
          value: maxLength,
        },
      })}
    />
  )
}

export default TextArea
