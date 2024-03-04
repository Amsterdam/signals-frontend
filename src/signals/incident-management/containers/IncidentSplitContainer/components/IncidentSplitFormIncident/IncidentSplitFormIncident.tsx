// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useCallback, useState } from 'react'
import type { FC } from 'react'

import { TrashBin } from '@amsterdam/asc-assets/lib/icons'
import { uniqueId } from 'lodash'
import { Controller, useFormContext } from 'react-hook-form'

import { getAddNoteError } from 'components/AddNote'
import Button from 'components/Button'
import SelectLoader from 'components/SelectLoader'
import type { SubcategoriesGrouped } from 'models/categories/selectors'
import {
  priorityList,
  typesList,
} from 'signals/incident-management/definitions'

import {
  RemoveButton,
  StyledHeading,
  StyledFieldset,
  StyledHeadingWrapper,
  StyledExtraIncidentButtonContainer,
  StyledAddNote,
} from './styled'
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
  const [subIncidents, setSubIncidents] = useState([{ id: uniqueId() }])

  const { control, unregister } = useFormContext()

  const [groups, options] = subcategories
  const maxDescriptionLength = 1000

  const addSubIncident = useCallback((event) => {
    event.preventDefault()

    setSubIncidents((map) => [...map, { id: uniqueId() }])
  }, [])

  const removeSubIncident = useCallback(
    (event, id) => {
      event.preventDefault()

      unregister(`incidents[${id}]`)

      setSubIncidents((map11) => map11.filter((item) => item.id !== id))
    },
    [unregister]
  )

  return (
    <>
      {subIncidents.map(({ id }, index) => {
        const subIncidentNumber = index + parentIncident.childrenCount + 1
        const canRemoveIncident = index !== 0 || subIncidents.length > 1

        return (
          <StyledFieldset key={`incident-splitform-incident-${id}`}>
            <StyledHeadingWrapper>
              <StyledHeading
                forwardedAs="h2"
                data-testid="incident-split-form-incident-title"
              >
                Deelmelding {subIncidentNumber}
              </StyledHeading>

              {canRemoveIncident && (
                <RemoveButton
                  icon={<TrashBin />}
                  iconSize={16}
                  onClick={(event) => removeSubIncident(event, id)}
                  variant="application"
                  aria-label="Verwijder deelmelding"
                />
              )}
            </StyledHeadingWrapper>

            {groups.length > 0 && options.length > 0 ? (
              <Controller
                name={`incidents.${id}.subcategory`}
                control={control}
                defaultValue={parentIncident.subcategory}
                render={({ field: { onChange, name } }) => (
                  <IncidentSplitSelectInput
                    data-testid={`incident-split-form-incident-subcategory-select-${id}`}
                    display="Subcategorie"
                    groups={groups}
                    id={`subcategory-${id}`}
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
              name={`incidents.${id}.description`}
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
                <StyledAddNote
                  {...field}
                  description="Zorg ervoor dat hier duidelijk staat wat het specifieke probleem is
                  dat de afdeling moet behandelen. Verwijder uit de meldtekst wat niet
                  van belang is. En verduidelijk het verzoek waar nodig is."
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
              name={`incidents.${id}.priority`}
              render={({ field: { onChange, name } }) => (
                <IncidentSplitRadioInput
                  data-testid={`incident-split-form-incident-priority-radio-${id}`}
                  display="Urgentie"
                  id={`priority-${id}`}
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
              name={`incidents.${id}.type`}
              render={({ field: { onChange, name } }) => (
                <IncidentSplitRadioInput
                  data-testid={`incident-split-form-incident-type-radio-${id}`}
                  display="Type"
                  id={`type-${id}`}
                  initialValue={parentIncident.type}
                  name={name}
                  onChange={onChange}
                  options={typesList}
                />
              )}
            />
          </StyledFieldset>
        )
      })}

      {subIncidents.length <
        INCIDENT_SPLIT_LIMIT - parentIncident.childrenCount && (
        <StyledExtraIncidentButtonContainer>
          <Button
            data-testid="incident-split-form-incident-split-button"
            type="button"
            variant="primaryInverted"
            onClick={addSubIncident}
          >
            Extra deelmelding toevoegen
          </Button>
        </StyledExtraIncidentButtonContainer>
      )}
    </>
  )
}

export default IncidentSplitFormIncident
