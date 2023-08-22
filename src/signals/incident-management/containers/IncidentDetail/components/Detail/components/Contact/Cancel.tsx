// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useForm } from 'react-hook-form'

import { CancelFormWrapper, StyledCancelForm } from './styled'
import TextArea from '../../../../../../../../components/TextArea'
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
      <StyledH2 forwardedAs="h2">Annuleer wijziging</StyledH2>

      <StyledCancelForm
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
        <TextArea
          {...register('reason')}
          label="Reden van de wijziging (niet verplicht)"
          placeholder="Omschrijf waarom de wijziging wordt geannuleerd"
        ></TextArea>
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
      </StyledCancelForm>
    </CancelFormWrapper>
  )
}
