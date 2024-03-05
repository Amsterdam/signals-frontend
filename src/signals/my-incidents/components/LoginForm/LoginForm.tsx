// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { useEffect } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import Button from 'components/Button'
import Label from 'components/Label'

import { ErrorWrapper, StyledErrorMessage, StyledInput } from './styled'
import { useMyIncidentContext } from '../../context'
import { routes } from '../../definitions'
import { usePostEmail } from '../../hooks'
import type { FormData } from '../types'

const schema = yup.object({
  email: yup
    .string()
    .email('Het veld moet een geldig e-mailadres bevatten')
    .required('Dit veld is verplicht'),
})

interface Props {
  setErrorMessage: (message: string) => void
}

export const LoginForm = ({ setErrorMessage }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const navigate = useNavigate()
  const [postEmail, { isSuccess, errorMessage }] = usePostEmail()
  const { setEmail } = useMyIncidentContext()

  const onSubmit = async ({ email }: FormData) => {
    ;(window as any)?.dataLayer.push({
      event: 'interaction.generic.component.linkClick',
      meta: {
        category: 'interaction.generic.component.linkClick',
        action: 'loginMail - intern',
        label: 'Inloggen',
      },
    })

    await postEmail(email)
    setEmail(email)
  }

  useEffect(() => {
    if (isSuccess) {
      navigate(`../${routes.confirm}`)
    }
  }, [isSuccess, navigate])

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(errorMessage)
    }
  }, [setErrorMessage, errorMessage])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ErrorWrapper invalid={Boolean(errors.email?.message)}>
        <Label htmlFor="email-address">E-mailadres</Label>
        {errors.email?.message && (
          <StyledErrorMessage
            id="textareaErrorMessage"
            message={errors.email.message}
          />
        )}
        <StyledInput {...register('email')} id={'email-address'} />
      </ErrorWrapper>

      <Button type="submit" variant="secondary">
        Inloggen
      </Button>
    </form>
  )
}
