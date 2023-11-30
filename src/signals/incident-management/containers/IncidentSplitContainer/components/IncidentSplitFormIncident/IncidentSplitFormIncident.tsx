// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useCallback, useState } from 'react'
import type { FC, BaseSyntheticEvent } from 'react'

import { TrashBin as DeleteIcon } from '@amsterdam/asc-assets/lib/icons'
import { uniqueId } from 'lodash'
import { Controller, useFormContext } from 'react-hook-form'

import AddNote, { getAddNoteError } from 'components/AddNote'
import Button from 'components/Button'
import SelectLoader from 'components/SelectLoader'
import type { SubcategoriesGrouped } from 'models/categories/selectors'
import {
  priorityList,
  typesList,
} from 'signals/incident-management/definitions'

import {
  StyledGrid,
  StyledHeading,
  StyledFieldset,
  StyledHeadingWrapper,
  StyledButton,
} from '../../styled'
import type { ParentIncident } from '../IncidentSplitForm'
import IncidentSplitRadioInput from '../IncidentSplitRadioInput'
import IncidentSplitSelectInput from '../IncidentSplitSelectInput'

export const INCIDENT_SPLIT_LIMIT = 10

interface IncidentSplitFormIncidentProps {
  parentIncident: ParentIncident
  subcategories: SubcategoriesGrouped
}

const IncidentSplitFormIncident: FC<IncidentSplitFormIncidentProps> = ({
  parentIncident,
  subcategories,
}) => {
  const [splitIds, setSplitIds] = useState([uniqueId()])
  const [groups, options] = subcategories
  const maxDescriptionLength = 1000
  const { control } = useFormContext()

  const addIncident = useCallback((event) => {
    event.preventDefault()
    setSplitIds((previousSplitIds) => [...previousSplitIds, uniqueId()])
  }, [])

  const removeSplitForm = useCallback((splitNumber) => {
    setSplitIds((previousSplitIds) =>
      previousSplitIds.filter((id) => id !== splitNumber)
    )
  }, [])

  return (
    <>
      {splitIds.map((splitNumber, index) => (
        <StyledFieldset key={`incident-splitform-incident-${splitNumber}`}>
          <StyledGrid>
            <StyledHeadingWrapper>
              <StyledHeading
                forwardedAs="h2"
                data-testid="incident-split-form-incident-title"
              >
                Deelmelding {index + 1 + parentIncident.childrenCount}
              </StyledHeading>
              <StyledButton
                data-testid={`incident-split-form-incident-delete-button-${
                  index + 1
                }`}
                onClick={(event: BaseSyntheticEvent) => {
                  event.preventDefault()
                  removeSplitForm(splitNumber)
                }}
                variant="application"
                iconSize={18}
                icon={<DeleteIcon />}
              />
            </StyledHeadingWrapper>

            {groups.length > 0 && options.length > 0 ? (
              <Controller
                name={`incidents[${index + 1}].subcategory`}
                control={control}
                defaultValue={parentIncident.subcategory}
                render={({ field: { onChange, name } }) => (
                  <IncidentSplitSelectInput
                    data-testid={`incident-split-form-incident-subcategory-select-${
                      index + 1
                    }`}
                    display="Subcategorie"
                    groups={groups}
                    id={`subcategory-${index + 1}`}
                    initialValue={parentIncident.subcategory}
                    name={name}
                    onChange={onChange}
                    options={options}
                  />
                )}
              />
            ) : (
              <SelectLoader label={<strong>Subcategorie</strong>} />
            )}

            <Controller
              name={`incidents[${index + 1}].description`}
              control={control}
              defaultValue={parentIncident.description}
              rules={{
                validate: (text: string) => {
                  const error = getAddNoteError({
                    fieldName: 'omschrijving',
                    maxContentLength: maxDescriptionLength,
                    text,
                  })

                  return error || true
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <AddNote
                  {...field}
                  error={error && error.message}
                  isStandalone={false}
                  label="Omschrijving"
                  maxContentLength={maxDescriptionLength}
                />
              )}
            />

            <Controller
              control={control}
              defaultValue={parentIncident.priority}
              name={`incidents[${index + 1}].priority`}
              render={({ field: { onChange, name } }) => (
                <IncidentSplitRadioInput
                  data-testid={`incident-split-form-incident-priority-radio-${
                    index + 1
                  }`}
                  display="Urgentie"
                  id={`priority-${index + 1}`}
                  initialValue={parentIncident.priority}
                  name={name}
                  onChange={onChange}
                  options={priorityList}
                />
              )}
            />

            <Controller
              control={control}
              defaultValue={parentIncident.type}
              name={`incidents[${index + 1}].type`}
              render={({ field: { onChange, name } }) => (
                <IncidentSplitRadioInput
                  data-testid={`incident-split-form-incident-type-radio-${
                    index + 1
                  }`}
                  display="Type"
                  id={`type-${index + 1}`}
                  initialValue={parentIncident.type}
                  name={name}
                  onChange={onChange}
                  options={typesList}
                />
              )}
            />
          </StyledGrid>
        </StyledFieldset>
      ))}

      {splitIds.length <
        INCIDENT_SPLIT_LIMIT - parentIncident.childrenCount && (
        <fieldset>
          <Button
            data-testid="incident-split-form-incident-split-button"
            type="button"
            variant="primaryInverted"
            onClick={addIncident}
          >
            Extra deelmelding toevoegen
          </Button>
        </fieldset>
      )}
    </>
  )
}

export default IncidentSplitFormIncident
