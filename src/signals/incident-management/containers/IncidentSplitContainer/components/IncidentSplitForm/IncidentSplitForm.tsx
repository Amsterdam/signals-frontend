// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { useCallback, Fragment } from 'react'
import type { FC } from 'react'

import { Heading, themeSpacing } from '@amsterdam/asc-ui'
import { Controller, useForm, FormProvider } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import AddNote, { getAddNoteError } from 'components/AddNote'
import Button from 'components/Button'
import type { SubcategoriesGrouped } from 'models/categories/selectors'

import {
  FormWrapper,
  StyledDefinitionList,
  StyledForm,
  StyledSubmitButton,
  ThinLabel,
} from '../../styled'
import IncidentSplitFormIncident from '../IncidentSplitFormIncident'
import IncidentSplitRadioInput from '../IncidentSplitRadioInput'

export const StyledIncidentSplitRadioInput = styled(IncidentSplitRadioInput)`
  padding-bottom: ${themeSpacing(6)};
`

export type IncidentSubType = {
  subcategory: string
  description: string
  priority: string
  type: string
}

export type SplitFormData = {
  department: string
  noteText: string
  incidents: Array<IncidentSubType>
}

export type ParentIncident = {
  id: string | number
  childrenCount: number
  status: string
  statusDisplayName: string
  priority: string
  subcategory: string
  subcategoryDisplayName: string
  description: string
  type: string
  directingDepartment: string
}

type IncidentSplitFormProps = {
  parentIncident: ParentIncident
  subcategories: SubcategoriesGrouped
  directingDepartments: Array<{ key: string; value: string }>
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

const IncidentSplitForm: FC<IncidentSplitFormProps> = ({
  parentIncident,
  subcategories,
  directingDepartments,
  onSubmit,
  isSubmitting,
}) => {
  const maxNoteLength = 1000
  const formMethods = useForm({ reValidateMode: 'onSubmit' })
  const { handleSubmit, control } = formMethods
  const history = useHistory()

  const onCancel = useCallback(() => {
    history.push(`/manage/incident/${parentIncident.id}`)
  }, [history, parentIncident.id])

  return (
    <FormProvider {...formMethods}>
      <FormWrapper>
        <StyledForm
          onSubmit={handleSubmit((data) => {
            onSubmit(data)
          })}
          data-testid="incident-split-form"
        >
          <Heading>Deelmelding maken</Heading>

          <fieldset>
            <Heading forwardedAs="h2">Hoofdmelding</Heading>

            <StyledDefinitionList>
              <dt>Melding</dt>
              <dd data-testid="incident-split-form-parent-incident-id">
                {parentIncident.id}
              </dd>

              <dt>Status</dt>
              <dd data-testid="incident-split-form-status-display-name">
                {parentIncident.statusDisplayName}
              </dd>

              <dt>Subcategorie (verantwoordelijke afdeling)</dt>
              <dd data-testid="incident-split-form-subcategory-display-name">
                {parentIncident.subcategoryDisplayName}
              </dd>
            </StyledDefinitionList>

            <Controller
              name="department"
              defaultValue={parentIncident.directingDepartment}
              render={({ field: { onChange } }) => (
                <StyledIncidentSplitRadioInput
                  data-testid="incident-split-form-radio-iInput-department"
                  display="Regie"
                  id="department"
                  initialValue={parentIncident.directingDepartment}
                  name="department"
                  options={directingDepartments}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              name="noteText"
              control={control}
              defaultValue=""
              rules={{
                validate: (text: string) => {
                  const error = getAddNoteError({
                    maxContentLength: maxNoteLength,
                    text,
                    shouldContainAtLeastOneChar: false,
                  })

                  return error || true
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <AddNote
                  {...field}
                  error={error?.message}
                  isStandalone={false}
                  label={
                    <Fragment>
                      Notitie <ThinLabel>(niet verplicht)</ThinLabel>
                    </Fragment>
                  }
                  maxContentLength={maxNoteLength}
                />
              )}
            />
          </fieldset>

          <IncidentSplitFormIncident
            parentIncident={parentIncident}
            subcategories={subcategories}
          />

          <div>
            <StyledSubmitButton
              data-testid="incident-split-form-submit-button"
              variant="secondary"
              disabled={isSubmitting}
            >
              Opslaan
            </StyledSubmitButton>

            <Button
              data-testid="incident-split-form-cancel-button"
              variant="tertiary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuleer
            </Button>
          </div>
        </StyledForm>
      </FormWrapper>
    </FormProvider>
  )
}

export default IncidentSplitForm
