// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { FormEventHandler } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'
import { Controller, FormProvider } from 'react-hook-form'
import type { UseFormRegister, UseFormReturn } from 'react-hook-form'

import Checkbox from 'components/Checkbox'
import Input from 'components/Input'
import RadioButtonList from 'components/RadioButtonList'
import TextArea from 'components/TextArea'
import type { History as HistoryType } from 'types/history'

import {
  FieldGroup,
  StyledColumn,
  Form,
  StyledDefinitionTerm,
  StyledHeading,
  StyledLabel,
  CombinedFields,
  StyledSelect,
  StyledHistory,
  StyledFormFooter,
} from './styled'
import type { CategoryFormValues } from '../types'

interface StatusOption {
  key: string
  value: string
}

export const statusOptions: StatusOption[] = [
  { key: 'true', value: 'Actief' },
  { key: 'false', value: 'Niet actief' },
]

interface Props {
  formMethods: UseFormReturn<CategoryFormValues>
  formValues: CategoryFormValues
  history: HistoryType[]
  onCancel: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
  readOnly: boolean
  register: UseFormRegister<CategoryFormValues>
  responsibleDepartments: string[]
}

export const CategoryForm = ({
  formMethods,
  formValues,
  history,
  onCancel,
  onSubmit,
  readOnly,
  register,
  responsibleDepartments,
}: Props) => (
  <FormProvider {...formMethods}>
    <Form onSubmit={onSubmit}>
      <Row>
        <StyledColumn
          span={{ small: 1, medium: 2, big: 4, large: 5, xLarge: 5 }}
        >
          <div>
            <FieldGroup>
              <Input
                {...register('name')}
                disabled={readOnly}
                hint="Het wijzigen van de naam heeft geen invloed op het type melding"
                id="name"
                label="Naam"
                name="name"
                readOnly={readOnly}
                type="text"
              />
            </FieldGroup>

            <Controller
              name="description"
              render={({ field: { name, value, onChange } }) => (
                <FieldGroup>
                  <TextArea
                    disabled={readOnly}
                    id={name}
                    label={<strong>Omschrijving</strong>}
                    name={name}
                    onChange={onChange}
                    readOnly={readOnly}
                    rows={6}
                    value={value}
                  />
                </FieldGroup>
              )}
            />

            {responsibleDepartments.length > 0 ? (
              <FieldGroup as="dl">
                <StyledDefinitionTerm>
                  <strong>Verantwoordelijke afdeling</strong>
                </StyledDefinitionTerm>
                <dd data-testid="responsible_departments">
                  {responsibleDepartments.join(', ')}
                </dd>
              </FieldGroup>
            ) : null}

            <Controller
              name="is_public_accessible"
              control={formMethods.control}
              render={({ field: { name, value, onChange } }) => (
                <FieldGroup>
                  <StyledHeading>Openbaar tonen</StyledHeading>
                  <>
                    <StyledLabel
                      htmlFor={name}
                      label="Toon meldingen van deze subcategorie op openbare kaarten en op de kaart in het meldformulier"
                      data-testid="subcategory-is-public-accessible"
                      disabled={readOnly}
                    >
                      <Checkbox
                        checked={value}
                        name={name}
                        id={name}
                        onChange={onChange}
                        value={value.toString()}
                      />
                    </StyledLabel>
                  </>
                </FieldGroup>
              )}
            />

            {formValues.is_public_accessible && (
              <FieldGroup>
                <Input
                  {...register('public_name')}
                  id="public_name"
                  label="Naam openbaar"
                  name="public_name"
                  type="text"
                  readOnly={readOnly}
                />
              </FieldGroup>
            )}

            <FieldGroup>
              <StyledHeading>Afhandeltermijn</StyledHeading>
              <CombinedFields>
                <Input
                  {...register('n_days')}
                  disabled={readOnly}
                  id="n_days"
                  name="n_days"
                  readOnly={readOnly}
                  type="number"
                  size={50}
                />

                <StyledSelect
                  {...register('use_calendar_days')}
                  disabled={readOnly}
                  id="use_calendar_days"
                >
                  <option value="1">Dagen</option>
                  <option value="0">Werkdagen</option>
                </StyledSelect>
              </CombinedFields>
            </FieldGroup>

            <Controller
              name="handling_message"
              render={({ field: { name, value, onChange } }) => (
                <FieldGroup>
                  <TextArea
                    disabled={readOnly}
                    id={name}
                    label={<strong>Servicebelofte</strong>}
                    name={name}
                    onChange={onChange}
                    readOnly={readOnly}
                    rows={6}
                    value={value}
                  />
                </FieldGroup>
              )}
            />

            <Controller
              name="is_active"
              control={formMethods.control}
              render={({ field: { name, value, onChange } }) => {
                const handleOnChange = (
                  _groupName: string,
                  option: StatusOption
                ) => {
                  const value = statusOptions.find(
                    (status) => status.value === option.value
                  )?.key
                  onChange(value)
                }

                return (
                  <FieldGroup>
                    <StyledHeading>Status</StyledHeading>
                    <RadioButtonList
                      defaultValue={value}
                      disabled={readOnly}
                      groupName={name}
                      hasEmptySelectionButton={false}
                      onChange={handleOnChange}
                      options={statusOptions}
                    />
                  </FieldGroup>
                )
              }}
            />
          </div>
        </StyledColumn>

        <StyledColumn
          span={{ small: 1, medium: 2, big: 6, large: 7, xLarge: 6 }}
        >
          <Column span={{ small: 1, medium: 2, big: 4, large: 5, xLarge: 5 }}>
            <Controller
              name="note"
              render={({ field: { name, value, onChange } }) => (
                <TextArea
                  disabled={readOnly}
                  id={name}
                  label={<strong>Notitie</strong>}
                  name={name}
                  onChange={onChange}
                  readOnly={readOnly}
                  rows={6}
                  value={value}
                />
              )}
            />
          </Column>

          {history && <StyledHistory list={history} />}
        </StyledColumn>

        {!readOnly && (
          <StyledFormFooter
            cancelBtnLabel="Annuleer"
            onCancel={onCancel}
            submitBtnLabel="Opslaan"
          />
        )}
      </Row>
    </Form>
  </FormProvider>
)
