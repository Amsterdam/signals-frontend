import { useCallback, useEffect, useState } from 'react'
import { Select, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { useMatomo } from '@datapunt/matomo-tracker-react'

import type { FC } from 'react'

import configuration from 'shared/services/configuration/configuration'

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0 ${themeSpacing(6)} 0 auto;

  label {
    margin-right: ${themeSpacing(3)};
    padding: 0;
    font-size: 1rem;
  }

  select {
    min-width: 220px;
  }
`

type SortProps = {
  activeSort?: SortOptions
  className?: ''
  onChangeOrdering: (sort: string) => void
}

export enum SortOptions {
  ADDRESS_ASC = 'address',
  ADDRESS_DESC = '-address',
  ASSIGNED_USER_EMAIL_ASC = 'assigned_user_email',
  ASSIGNED_USER_EMAIL_DESC = '-assigned_user_email',
  BUROUGH_ASC = 'stadsdeel',
  BUROUGH_DESC = '-stadsdeel',
  DISTRICT_ASC = 'area_name',
  DISTRICT_DESC = '-area_name',
  CREATED_AT_ASC = '-created_at',
  CREATED_AT_DESC = 'created_at',
  PRIORITY_ASC = 'priority',
  PRIORITY_DESC = '-priority',
  STATUS_ASC = 'status',
  STATUS_DESC = '-status',
  SUBCATEGORY_ASC = 'sub_category',
  SUBCATEGORY_DESC = '-sub_category',
}

const Sort: FC<SortProps> = ({
  activeSort = SortOptions.CREATED_AT_ASC,
  className = '',
  onChangeOrdering,
}) => {
  const { trackEvent } = useMatomo()
  const [sort, setSort] = useState<SortOptions>()
  const onChange = useCallback(
    (event) => {
      const { value } = event.target

      if (sort !== value) {
        trackEvent({
          action: 'change',
          category: 'incidents',
          name: 'sort',
          value,
        })
        setSort(value)
      }
    },
    [sort, trackEvent]
  )

  useEffect(() => {
    if (!sort) return
    onChangeOrdering(sort)
  }, [onChangeOrdering, sort])

  return (
    <SelectContainer className={className}>
      <Select
        data-testid="incidentSortSelect"
        defaultValue={activeSort}
        id="sortSelect"
        label="Sorteren"
        onChange={onChange}
      >
        <option value={SortOptions.CREATED_AT_ASC}>Datum: nieuw - oud</option>
        <option value={SortOptions.CREATED_AT_DESC}>Datum: oud - nieuw</option>
        <option value={SortOptions.SUBCATEGORY_ASC}>Subcategorie: A-Z</option>
        <option value={SortOptions.SUBCATEGORY_DESC}>Subcategorie: Z-A</option>
        <option value={SortOptions.STATUS_ASC}>Status A-Z</option>
        <option value={SortOptions.STATUS_DESC}>Status Z-A</option>
        {configuration.featureFlags.fetchDistrictsFromBackend ? (
          <>
            <option value={SortOptions.DISTRICT_ASC}>
              {configuration.language.district} A-Z
            </option>
            <option value={SortOptions.DISTRICT_DESC}>
              {configuration.language.district} Z-A
            </option>
          </>
        ) : (
          <>
            <option value={SortOptions.BUROUGH_ASC}>Stadsdeel A-Z</option>
            <option value={SortOptions.BUROUGH_DESC}>Stadsdeel Z-A</option>
          </>
        )}
        <option value={SortOptions.PRIORITY_ASC}>Urgentie: hoog - laag</option>
        <option value={SortOptions.PRIORITY_DESC}>Urgentie: laag - hoog</option>
        <option value={SortOptions.ADDRESS_ASC}>Adres A-Z</option>
        <option value={SortOptions.ADDRESS_DESC}>Adres Z-A</option>

        {configuration.featureFlags.assignSignalToEmployee && (
          <>
            <option value={SortOptions.ASSIGNED_USER_EMAIL_ASC}>
              Toegewezen aan: A-Z
            </option>
            <option value={SortOptions.ASSIGNED_USER_EMAIL_DESC}>
              Toegewezen aan: Z-A
            </option>
          </>
        )}
      </Select>
    </SelectContainer>
  )
}

export default Sort
