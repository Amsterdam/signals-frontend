// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useCallback, Fragment } from 'react'
import styled from 'styled-components'
import { useForm, Controller } from 'react-hook-form'
import { useHistory } from 'react-router-dom'

import { Heading, themeSpacing } from '@amsterdam/asc-ui'

import Button from 'components/Button'
import AddNote, {
  getAddNoteError,
} from 'signals/incident-management/components/AddNote'

import type { FC } from 'react'
import type { SubcategoriesGrouped } from 'models/categories/selectors'

import {
  StyledDefinitionList,
  StyledForm,
  StyledSubmitButton,
  FormWrapper,
} from '../../styled'

import IncidentSplitFormIncident from '../IncidentSplitFormIncident'
import IncidentSplitRadioInput from '../IncidentSplitRadioInput'

export const StyledIncidentSplitRadioInput = styled(IncidentSplitRadioInput)`
  padding-bottom: ${themeSpacing(6)};
`

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

type SplitFormData = {
  department: string
  noteText: string
}

const IncidentSplitForm: FC<IncidentSplitFormProps> = ({
  parentIncident,
  subcategories,
  directingDepartments,
  onSubmit,
  isSubmitting,
}) => {
  const maxContentLength = 1000
  const { handleSubmit, register, errors, control, formState } =
    useForm<SplitFormData>()

  const history = useHistory()

  const onCancel = useCallback(() => {
    history.push(`/manage/incident/${parentIncident.id}`)
  }, [history, parentIncident.id])

  return (
    <FormWrapper>
      <StyledForm
        onSubmit={handleSubmit((data) => {
          onSubmit(data)
        })}
        data-testid="incidentSplitForm"
      >
        <Heading>Deelmelding maken</Heading>

        <fieldset>
          <Heading forwardedAs="h2">Hoofdmelding</Heading>

          <StyledDefinitionList>
            <dt>Melding</dt>
            <dd data-testid="incidentSplitFormParentIncidentId">
              {parentIncident.id}
            </dd>

            <dt>Status</dt>
            <dd data-testid="incidentSplitFormStatusDisplayName">
              {parentIncident.statusDisplayName}
            </dd>

            <dt>Subcategorie (verantwoordelijke afdeling)</dt>
            <dd data-testid="incidentSplitFormSubcategoryDisplayName">
              {parentIncident.subcategoryDisplayName}
            </dd>
          </StyledDefinitionList>

          <StyledIncidentSplitRadioInput
            data-testid="incidentSplitFormRadioInputDepartment"
            display="Regie"
            id="department"
            initialValue={parentIncident.directingDepartment}
            name="department"
            options={directingDepartments}
            register={register}
          />

          <Controller
            name="noteText"
            control={control}
            defaultValue=""
            rules={{
              validate: (value: string) =>
                getAddNoteError(maxContentLength)(value),
            }}
            render={(controllerRenderProps) => (
              <AddNote
                {...controllerRenderProps}
                error={
                  formState.errors.noteText && formState.errors.noteText.message
                }
                isStandalone={false}
                label={
                  <Fragment>
                    <strong>Notitie</strong> (niet verplicht)
                  </Fragment>
                }
                maxContentLength={maxContentLength}
              />
            )}
          />
        </fieldset>

        <IncidentSplitFormIncident
          parentIncident={parentIncident}
          subcategories={subcategories}
          register={register}
          errors={errors}
        />

        <div>
          <StyledSubmitButton
            data-testid="incidentSplitFormSubmitButton"
            variant="secondary"
            disabled={isSubmitting}
          >
            Opslaan
          </StyledSubmitButton>

          <Button
            data-testid="incidentSplitFormCancelButton"
            variant="tertiary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuleer
          </Button>
        </div>
      </StyledForm>
    </FormWrapper>
  )
}

export default IncidentSplitForm
