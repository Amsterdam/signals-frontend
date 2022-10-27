// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useRef, useState } from 'react'

import * as yup from 'yup'

import Button from 'components/Button'
import Label from 'components/Label'

import { usePostEmail } from '../hooks'
import { ErrorWrapper, StyledErrorMessage, StyledInput } from './styled'

const schema = yup.string().email().max(254)

const validateInput = async (
  inputRef: React.RefObject<HTMLInputElement>,
  setError: (message: string | null) => void
) => {
  const isValid = await schema
    .isValid(inputRef?.current?.value)
    .then((valid) => valid)

  if (isValid) {
    setError(null)
  } else {
    setError('Het veld moet een geldig e-mailadres bevatten')
  }
}

export const EmailInput = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const [postEmail] = usePostEmail()

  const handleSubmit = () => {
    validateInput(inputRef, setError)

    inputRef?.current && postEmail(inputRef.current.value, !error)
  }

  const handleOnBlur = () => {
    validateInput(inputRef, setError)
  }

  const handleOnChange = () => {
    if (error) {
      validateInput(inputRef, setError)
    }
  }

  return (
    <>
      <ErrorWrapper invalid={Boolean(error)}>
        <Label htmlFor="email-address">E-mailadres</Label>
        <div role="status">
          {error && (
            <StyledErrorMessage id="textareaErrorMessage" message={error} />
          )}
        </div>
        <StyledInput
          id="email-address"
          ref={inputRef}
          onBlur={handleOnBlur}
          onChange={handleOnChange}
        />
      </ErrorWrapper>
      <Button variant="secondary" onClick={handleSubmit}>
        Inloggen
      </Button>
    </>
  )
}
