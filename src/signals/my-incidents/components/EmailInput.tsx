// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useRef, useState } from 'react'

import { useHistory } from 'react-router-dom'
import * as yup from 'yup'

import Button from 'components/Button'
import Label from 'components/Label'

import { useMyIncidentContext } from '../context'
import { routes } from '../definitions'
import { usePostEmail } from '../hooks'
import { ErrorWrapper, StyledErrorMessage, StyledInput } from './styled'
import type { Error } from './types'

const schema = yup.string().email().required().max(254)

const validateInput = async (
  inputRef: React.RefObject<HTMLInputElement>,
  setValidation: (error: Error) => void
) => {
  const isValid = await schema
    .isValid(inputRef?.current?.value)
    .then((valid) => valid)

  if (isValid) {
    setValidation({
      hasError: !isValid,
      message: null,
    })
  } else {
    setValidation({
      hasError: !isValid,
      message: 'Het veld moet een geldig e-mailadres bevatten',
    })
  }
}

export const EmailInput = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [validation, setValidation] = useState<Error>({
    hasError: false,
    message: null,
  })

  const history = useHistory()
  const [postEmail] = usePostEmail()

  const { setEmail } = useMyIncidentContext()

  const handleSubmit = () => {
    validateInput(inputRef, setValidation)

    if (!validation.hasError && inputRef?.current?.value) {
      setEmail(inputRef.current.value)
      postEmail(inputRef.current.value)
      history.push(routes.confirm)
    }
  }

  const handleOnBlur = () => {
    validateInput(inputRef, setValidation)
  }

  const handleOnChange = () => {
    if (validation.hasError) {
      validateInput(inputRef, setValidation)
    }
  }

  return (
    <>
      <ErrorWrapper invalid={validation.hasError}>
        <Label htmlFor="email-address">E-mailadres</Label>
        <div role="status">
          {validation.message && (
            <StyledErrorMessage
              id="textareaErrorMessage"
              message={validation.message}
            />
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
