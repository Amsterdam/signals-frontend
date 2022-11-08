// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import * as yup from 'yup'

import Button from 'components/Button'
import Label from 'components/Label'

import { useMyIncidentContext } from '../../context'
import { routes } from '../../definitions'
import { usePostEmail } from '../../hooks'
import type { FormData } from '../types'
import { ErrorWrapper, StyledErrorMessage, StyledInput } from './styled'

const schema = yup.object({
  email: yup
    .string()
    .email('Het veld moet een geldig e-mailadres bevatten')
    .required('Dit veld is verplicht'),
})

export const EmailInput = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  const history = useHistory()
  const [postEmail] = usePostEmail()
  const { setEmail } = useMyIncidentContext()

  const onSubmit = ({ email }: FormData) => {
    postEmail(email)
    setEmail(email)
    history.push(routes.confirm)
  }

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
        <StyledInput {...register('email')} />
      </ErrorWrapper>

      <Button type="submit" variant="secondary">
        Inloggen
      </Button>
    </form>
  )
}
