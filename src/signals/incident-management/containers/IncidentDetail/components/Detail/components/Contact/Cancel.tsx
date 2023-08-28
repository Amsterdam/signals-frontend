// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Label } from '@amsterdam/asc-ui'
import { useForm } from 'react-hook-form'

import TextArea from 'components/TextArea'

import { CancelFormWrapper, StyledForm } from './styled'
import { StyledButton, StyledH2 } from '../../../StatusForm/styled'

type Props = {
  onClose: () => void
  onSubmit: (data: FormValues) => void
}

type FormValues = {
  [key: string]: string
}

export default function Cancel({ onClose, onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      reason: '',
    },
  })

  const { dirtyFields } = formState

  return (
    <CancelFormWrapper>
      <StyledH2 forwardedAs="h2">Annuleer e-mail wijziging</StyledH2>

      <StyledForm
        onSubmit={handleSubmit((data) => {
          const dirtyKeys = Object.keys(dirtyFields)
          const dirtyData = dirtyKeys.reduce((acc, key) => {
            if (data[key]) {
              acc[key] = data[key]
            }
            return acc
          }, {} as FormValues)

          onSubmit(dirtyData)
          onClose()
        })}
      >
        <div>
          <Label
            htmlFor="reason"
            label={
              <>
                <strong>Reden van de wijziging</strong>
                <span>&nbsp;(niet verplicht)</span>
              </>
            }
          />
          <TextArea
            {...register('reason')}
            placeholder="Omschrijf waarom de wijziging wordt geannuleerd"
          ></TextArea>
        </div>
        <div>
          <StyledButton
            data-testid="cancel-form-submit-button"
            type="submit"
            variant="secondary"
          >
            Opslaan
          </StyledButton>

          <StyledButton
            data-testid="cancel-form-cancel-button"
            variant="tertiary"
            onClick={onClose}
          >
            Annuleer
          </StyledButton>
        </div>
      </StyledForm>
    </CancelFormWrapper>
  )
}
