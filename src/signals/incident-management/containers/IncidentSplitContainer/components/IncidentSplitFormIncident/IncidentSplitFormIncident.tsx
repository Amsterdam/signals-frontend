// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useCallback, useState } from 'react'
import type { FC } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import AddNote, { getAddNoteError } from 'components/AddNote'
import Button from 'components/Button'
import SelectLoader from 'components/SelectLoader'
import type { SubcategoriesGrouped } from 'models/categories/selectors'
import {
  priorityList,
  typesList,
} from 'signals/incident-management/definitions'

import { StyledGrid, StyledHeading, StyledFieldset } from '../../styled'
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
  const [splitCount, setSplitCount] = useState(1)
  const [groups, options] = subcategories
  const maxDescriptionLength = 1000
  const { control } = useFormContext()

  const addIncident = useCallback((event) => {
    event.preventDefault()
    setSplitCount((previousSplitCount) => previousSplitCount + 1)
  }, [])

  return (
    <>
      {[...Array(splitCount + 1).keys()].slice(1).map((splitNumber) => (
        <StyledFieldset key={`incident-splitform-incident-${splitNumber}`}>
          <StyledGrid>
            <StyledHeading
              forwardedAs="h2"
              data-testid="incident-split-form-incident-title"
            >
              Deelmelding {splitNumber + parentIncident.childrenCount}
            </StyledHeading>

            {groups.length > 0 && options.length > 0 ? (
              <Controller
                name={`incidents[${splitNumber}].subcategory`}
                control={control}
                defaultValue={parentIncident.subcategory}
                render={({ field: { onChange, name } }) => (
                  <IncidentSplitSelectInput
                    data-testid={`incident-split-form-incident-subcategory-select-${splitNumber}`}
                    display="Subcategorie"
                    groups={groups}
                    id={`subcategory-${splitNumber}`}
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
              name={`incidents[${splitNumber}].description`}
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
              name={`incidents[${splitNumber}].priority`}
              render={({ field: { onChange, name } }) => (
                <IncidentSplitRadioInput
                  data-testid={`incident-split-form-incident-priority-radio-${splitNumber}`}
                  display="Urgentie"
                  id={`priority-${splitNumber}`}
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
              name={`incidents[${splitNumber}].type`}
              render={({ field: { onChange, name } }) => (
                <IncidentSplitRadioInput
                  data-testid={`incident-split-form-incident-type-radio-${splitNumber}`}
                  display="Type"
                  id={`type-${splitNumber}`}
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

      {splitCount < INCIDENT_SPLIT_LIMIT - parentIncident.childrenCount && (
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
