// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import ErrorMessage from 'components/ErrorMessage'
import type { Incident } from 'types/incident'

import { StyledForm, StyledInput, EditFormWrapper } from './styled'
import { StyledButton, StyledH2 } from '../../../StatusForm/styled'

type Props = {
  onClose: () => void
  incident: Incident
  submit: (
    data: { email?: string; phone?: string },
    hasDirtyFields: boolean
  ) => void
}

const Edit = ({ onClose, incident, submit }: Props) => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email(
        'Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl.'
      )
      .required(
        'E-mailadres mag niet leeg zijn. Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl.'
      ),
    phone: yup
      .string()
      .matches(
        /^(?:(\+|\(|\)|\s|-|[0-9]){3,20})?$/,
        'Vul een geldig telefoonnummer in. Alleen cijfers, spaties, haakjes, + en - zijn toegestaan.'
      ),
  })

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: incident.email,
      phone: incident.phone,
    },
    resolver: yupResolver(schema),
  })

  const { errors, dirtyFields } = formState
  return (
    <EditFormWrapper>
      <StyledH2 forwardedAs="h2">Contactgegevens melder wijzigen</StyledH2>

      <StyledForm
        onSubmit={handleSubmit((data) => {
          submit(data, !!(dirtyFields.email || dirtyFields.phone))
        })}
      >
        <div>
          <StyledInput
            {...register('phone')}
            id={'phone'}
            placeholder="Telefoon melder"
            defaultValue={incident.reporter.phone}
            showError={!!errors.phone}
          />
          {errors?.phone?.message && (
            <ErrorMessage
              data-testid="invalid-phone"
              message={errors.phone?.message}
            />
          )}
        </div>
        <div>
          <StyledInput
            {...register('email')}
            id={'email'}
            placeholder={'E-mail melder'}
            defaultValue={incident.reporter.email}
            showError={!!errors.email}
          />
          {errors?.email?.message && (
            <ErrorMessage
              data-testid="invalid-email"
              message={errors.email?.message}
            />
          )}
        </div>

        <div>
          <StyledButton
            data-testid="contact-form-submit-button"
            type="submit"
            variant="secondary"
          >
            Opslaan
          </StyledButton>

          <StyledButton
            data-testid="contact-form-cancel-button"
            variant="tertiary"
            onClick={onClose}
          >
            Annuleer
          </StyledButton>
        </div>
      </StyledForm>
    </EditFormWrapper>
  )
}

export default Edit
