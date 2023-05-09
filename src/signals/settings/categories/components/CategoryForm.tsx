// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { FormEventHandler } from 'react'
import { useCallback, useRef, useState } from 'react'

import { TrashBin } from '@amsterdam/asc-assets'
import { Column, Row } from '@amsterdam/asc-ui'
import type { UseFormReturn } from 'react-hook-form'
import { Controller, FormProvider } from 'react-hook-form'

import Checkbox from 'components/Checkbox'
import Input from 'components/Input'
import RadioButtonList from 'components/RadioButtonList'
import TextArea from 'components/TextArea'
import type { History as HistoryType } from 'types/history'

import { AddIconExplanation } from './AddIconExplanation'
import {
  CombinedFields,
  DeleteButton,
  FieldGroup,
  Form,
  FormContainer,
  IconUploadWrapper,
  StyledAlert,
  StyledButton,
  StyledColumn,
  StyledDefinitionTerm,
  StyledFormFooter,
  StyledHeading,
  StyledHistory,
  StyledImg,
  StyledLabel,
  StyledSelect,
  WrapperInputIcon,
  WrapperSetIcon,
} from './styled'
import ErrorMessage from '../../../../components/ErrorMessage'
import type { CategoryFormValues } from '../types'

const ALLOWED_FILE_TYPE = 'svg'
const MAX = 32 // 32 px is max height and width of icon

interface StatusOption {
  key: string
  value: string
}

export const statusOptions: StatusOption[] = [
  { key: 'true', value: 'Actief' },
  { key: 'false', value: 'Niet actief' },
]

export interface Props {
  formMethods: UseFormReturn<CategoryFormValues>
  formValues: CategoryFormValues
  history: HistoryType[]
  onCancel: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
  readOnly: boolean
  responsibleDepartments: string[]
  isMainCategory: boolean
  isPublicAccessibleLabel: string
  updateErrorUploadIcon: (arg: boolean) => void
}

export const CategoryForm = ({
  formMethods,
  formValues,
  history,
  onCancel,
  onSubmit,
  readOnly,
  responsibleDepartments,
  isMainCategory,
  isPublicAccessibleLabel,
  updateErrorUploadIcon,
}: Props) => {
  const [error, setError] = useState('')
  const [$hasError, set$hasError] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  /* istanbul ignore next */
  const onKeyDownHandler = useCallback((event) => {
    if (['Enter', 'Space'].includes(event.code)) {
      inputRef.current?.click()
    }
  }, [])

  return (
    <FormProvider {...formMethods}>
      <FormContainer>
        <Form onSubmit={onSubmit} data-testid="detail-category-form">
          <Row>
            <StyledColumn
              span={{ small: 1, medium: 2, big: 4, large: 5, xLarge: 5 }}
            >
              <div>
                <FieldGroup>
                  {!isMainCategory ? (
                    <Input
                      {...formMethods.register('name')}
                      disabled={readOnly}
                      hint="Het wijzigen van de naam heeft geen invloed op het type melding"
                      id="name"
                      label="Naam"
                      name="name"
                      readOnly={readOnly}
                      type="text"
                    />
                  ) : (
                    <>
                      <StyledDefinitionTerm>
                        <strong>Naam</strong>
                      </StyledDefinitionTerm>
                      <dd data-testid="name">{formValues.name}</dd>
                    </>
                  )}
                </FieldGroup>

                {!isMainCategory && (
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
                )}

                {responsibleDepartments.length > 0 && (
                  <FieldGroup as="dl">
                    <StyledDefinitionTerm>
                      <strong>Verantwoordelijke afdeling</strong>
                    </StyledDefinitionTerm>
                    <dd data-testid="responsible_departments">
                      {responsibleDepartments.join(', ')}
                    </dd>
                  </FieldGroup>
                )}

                <FieldGroup>
                  <StyledHeading>Openbaar tonen</StyledHeading>
                  <Controller
                    name="is_public_accessible"
                    control={formMethods.control}
                    render={({ field: { name, value, onChange } }) => (
                      <FieldGroup>
                        <StyledLabel
                          htmlFor={name}
                          label={isPublicAccessibleLabel}
                          data-testid="category-is-public-accessible"
                          disabled={readOnly}
                        >
                          <Checkbox
                            checked={value}
                            name={name}
                            id={name}
                            onChange={onChange}
                          />
                        </StyledLabel>
                      </FieldGroup>
                    )}
                  />
                  {isMainCategory && (
                    <Controller
                      name="show_children_in_filter"
                      control={formMethods.control}
                      render={({ field: { name, value, onChange } }) => (
                        <StyledLabel
                          htmlFor={name}
                          label="Toon alle subcategorieën in het filter op de meldingenkaart die openbaar getoond mogen worden"
                          data-testid="show_children_in_filter"
                          disabled={readOnly}
                        >
                          <Checkbox
                            checked={value}
                            name={name}
                            id={name}
                            onChange={onChange}
                          />
                        </StyledLabel>
                      )}
                    />
                  )}
                </FieldGroup>

                <Controller
                  name="addIcon"
                  render={({ field: { name, value, onChange } }) => {
                    const IconButtonText = value
                      ? 'Icoon wijzigen'
                      : 'Icoon toevoegen'
                    return (
                      <FieldGroup>
                        <AddIconExplanation />
                        <IconUploadWrapper>
                          {value && (
                            <>
                              <StyledImg
                                alt={'icon added'}
                                src={
                                  value instanceof File
                                    ? window.URL.createObjectURL(value)
                                    : value
                                }
                              />
                              <StyledAlert>
                                <b>
                                  Let op! Er wordt geen back-up van het icoon
                                  gemaakt.
                                </b>
                                <p>
                                  Om te annuleren gebruik de knop onderaan de
                                  pagina.
                                </p>
                              </StyledAlert>
                            </>
                          )}
                          {error && <ErrorMessage message={error} />}
                          <WrapperSetIcon>
                            <WrapperInputIcon
                              onKeyDown={onKeyDownHandler}
                              data-testid="file-input-upload-button"
                            >
                              <input
                                ref={inputRef}
                                type="file"
                                id="iconUpload"
                                multiple={false}
                                name={name}
                                value={value?.fileName}
                                onChange={(event) => {
                                  if (
                                    event.target.files &&
                                    event.target.files[0]
                                  ) {
                                    setError('')
                                    set$hasError(false)
                                    onChange(undefined)
                                    const file = event.target.files[0]
                                    if (
                                      file.name.slice(file.name.length - 3) !=
                                      ALLOWED_FILE_TYPE
                                    ) {
                                      updateErrorUploadIcon(true)
                                      set$hasError(true)
                                      setError(
                                        'Dit is het verkeerde bestandstype. Upload een .svg-bestand.'
                                      )
                                      return
                                    }

                                    const parser = new DOMParser()

                                    file.text().then((icon) => {
                                      const svgDoc = parser.parseFromString(
                                        icon,
                                        'image/svg+xml'
                                      )
                                      const heightExists = svgDoc
                                        .querySelector('svg')
                                        ?.getAttribute('height')
                                      const widthExists = svgDoc
                                        .querySelector('svg')
                                        ?.getAttribute('width')

                                      if (!heightExists) {
                                        setError(
                                          'Dit icoon heeft geen height. Gebruik alleen iconen met een height.'
                                        )
                                        return
                                      }

                                      if (!widthExists) {
                                        setError(
                                          'Dit icoon heeft geen width. Gebruik alleen iconen met een width.'
                                        )
                                        return
                                      }
                                      const height = parseInt(heightExists)
                                      const width = parseInt(widthExists)

                                      if (height > MAX || width > MAX) {
                                        updateErrorUploadIcon(true)
                                        set$hasError(true)
                                        setError(
                                          `De afmetingen van het bestand zijn te groot. De height is ${height} en de width is ${width}. Maximaal 32px bij 32px.`
                                        )
                                        return
                                      }

                                      onChange(file)
                                    })
                                  }
                                }}
                              />
                              <label htmlFor="iconUpload">
                                <StyledButton
                                  name="Icon"
                                  variant="application"
                                  type="button"
                                  forwardedAs={'span'}
                                  tabIndex={0}
                                  $hasError={$hasError}
                                >
                                  {IconButtonText}
                                </StyledButton>
                              </label>
                            </WrapperInputIcon>

                            {value && (
                              <DeleteButton
                                variant="blank"
                                icon={<TrashBin />}
                                data-testid="delete-icon-button"
                                aria-label={`Verwijder icoon`}
                                type="button"
                                onClick={() => {
                                  setError('')
                                  return onChange(undefined)
                                }}
                              />
                            )}
                          </WrapperSetIcon>
                        </IconUploadWrapper>
                      </FieldGroup>
                    )
                  }}
                />

                {formValues.is_public_accessible && (
                  <FieldGroup>
                    <Input
                      {...formMethods.register('public_name')}
                      id="public_name"
                      label="Naam openbaar"
                      name="public_name"
                      type="text"
                      readOnly={readOnly}
                    />
                  </FieldGroup>
                )}

                {!isMainCategory && (
                  <>
                    <FieldGroup>
                      <StyledHeading>Afhandeltermijn</StyledHeading>
                      <CombinedFields>
                        <Input
                          {...formMethods.register('n_days')}
                          disabled={readOnly}
                          id="n_days"
                          name="n_days"
                          readOnly={readOnly}
                          type="number"
                          size={50}
                        />

                        <StyledSelect
                          {...formMethods.register('use_calendar_days')}
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
                          /* istanbul ignore next */
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
                  </>
                )}
              </div>
            </StyledColumn>

            <StyledColumn
              span={{ small: 1, medium: 2, big: 6, large: 7, xLarge: 6 }}
            >
              <Column
                span={{ small: 1, medium: 2, big: 4, large: 5, xLarge: 5 }}
              >
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
      </FormContainer>
    </FormProvider>
  )
}
