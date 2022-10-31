// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useContext, useRef, useState } from 'react'

import { useHistory } from 'react-router-dom'
import * as yup from 'yup'

import Button from 'components/Button'
import Label from 'components/Label'

import MyIncidentsContext from '../context'
import { routes } from '../definitions'
import { usePostEmail } from '../hooks'
import { ErrorWrapper, StyledErrorMessage, StyledInput } from './styled'
import type { Error } from './types'

const schema = yup.string().email().max(254)

const validateInput = async (
  inputRef: React.RefObject<HTMLInputElement>,
  setError: (error: Error) => void
) => {
  const isValid = await schema
    .isValid(inputRef?.current?.value)
    .then((valid) => valid)

  if (isValid) {
    setError({
      hasError: !isValid,
      message: null,
    })
  } else {
    setError({
      hasError: !isValid,
      message: 'Het veld moet een geldig e-mailadres bevatten',
    })
  }
}

export const EmailInput = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [validation, setError] = useState<Error>({
    hasError: false,
    message: null,
  })

  const history = useHistory()
  const [postEmail] = usePostEmail()
  const { setEmail } = useContext(MyIncidentsContext)

  const handleSubmit = () => {
    validateInput(inputRef, setError)

    if (!validation.hasError && inputRef?.current) {
      setEmail(inputRef.current.value)
      postEmail(inputRef.current.value)
      history.push(routes.confirm)
    }
  }

  const handleOnBlur = () => {
    validateInput(inputRef, setError)
  }

  const handleOnChange = () => {
    if (validation.hasError) {
      validateInput(inputRef, setError)
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
