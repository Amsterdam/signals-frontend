// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { FunctionComponent, useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'
import parseISO from 'date-fns/parseISO'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { ChevronUp, ChevronDown, Play } from '@amsterdam/asc-assets'
import { Icon } from '@amsterdam/asc-ui'

import { string2date, string2time } from 'shared/services/string-parser'
import {
  getListValueByKey,
  getListIconByKey,
} from 'shared/services/list-helpers/list-helpers'
import configuration from 'shared/services/configuration/configuration'
import { statusList } from 'signals/incident-management/definitions'
import ParentIncidentIcon from 'components/ParentIncidentIcon'

import type {
  Status,
  Priority,
  Definition,
} from 'signals/incident-management/definitions/types'
import { IncidentListItem, IncidentList } from 'types/api/incident-list'
import { formatAddress } from 'shared/services/format-address'
import IncidentManagementContext from '../../../../context'
import {
  Th,
  TdStyle,
  ThArea,
  ThDate,
  ThParent,
  ThPriority,
  ThStatus,
  ThSubcategory,
  StyledList,
  Table,
  StyledIcon,
} from './styles'

export const getDaysOpen = (incident: IncidentListItem) => {
  const statusesWithoutDaysOpen = statusList
    .filter(
      ({ shows_remaining_sla_days }) => shows_remaining_sla_days === false
    )
    .map(({ key }) => key)
  const hasDaysOpen =
    incident.status && !statusesWithoutDaysOpen.includes(incident.status.state)

  const createdAtDate = parseISO(incident.created_at)

  if (!hasDaysOpen || isNaN(createdAtDate.getTime())) return '-'

  return differenceInCalendarDays(new Date(), createdAtDate)
}

const Td: FunctionComponent<{ detailLink: string }> = ({
  detailLink,
  children,
  ...rest
}) => (
  <TdStyle {...rest}>
    <span>
      <Link to={detailLink}>{children}</Link>
    </span>
  </TdStyle>
)

const ChildIcon: FunctionComponent = () => (
  <StyledIcon size={14} role="img" aria-label="Deelmelding">
    <Play />
  </StyledIcon>
)

interface ListProps {
  className?: string
  incidents: IncidentList
  isLoading?: boolean
  onChangeOrdering: (sort: string) => void
  priority: Priority[]
  stadsdeel: Definition[]
  status: Status[]
  sort: string
}

const List: FunctionComponent<ListProps> = ({
  className,
  incidents,
  isLoading = false,
  onChangeOrdering,
  priority,
  sort,
  stadsdeel,
  status,
}) => {
  const { districts } = useContext(IncidentManagementContext)

  const onSort = useCallback(
    (newSort) => () => {
      const sortIsAsc = sort.indexOf(newSort) === 0
      onChangeOrdering(sortIsAsc ? `-${newSort}` : newSort)
    },
    [onChangeOrdering, sort]
  )

  const renderChevron = useCallback(
    (column) => {
      const currentSort = sort.split(',')[0]
      const isColumnSorted = currentSort.indexOf(column) > -1
      const sortDirection = currentSort.charAt(0) === '-' ? 'down' : 'up'

      return isColumnSorted ? (
        <Icon inline size={12}>
          {sortDirection === 'up' ? <ChevronDown /> : <ChevronUp />}
        </Icon>
      ) : null
    },
    [sort]
  )

  return (
    <StyledList
      isLoading={isLoading}
      className={className}
      data-testid="incidentOverviewListComponent"
    >
      <Table cellSpacing="0">
        <thead>
          <tr>
            <ThParent data-testid="parent"></ThParent>
            <ThPriority data-testid="priority"></ThPriority>
            <Th data-testid="sortId" onClick={onSort('id')}>
              Id {renderChevron('id')}
            </Th>
            <Th data-testid="sortDaysOpen" onClick={onSort('days_open')}>
              Dag {renderChevron('days_open')}
            </Th>
            <ThDate data-testid="sortCreatedAt" onClick={onSort('created_at')}>
              Datum en tijd {renderChevron('created_at')}
            </ThDate>
            <ThSubcategory
              data-testid="sortSubcategory"
              onClick={onSort('sub_category,-created_at')}
            >
              Subcategorie {renderChevron('sub_category')}
            </ThSubcategory>
            <ThStatus
              data-testid="sortStatus"
              onClick={onSort('status,-created_at')}
            >
              Status {renderChevron('status')}
            </ThStatus>
            {configuration.featureFlags.fetchDistrictsFromBackend ? (
              <ThArea
                data-testid="sortDistrict"
                onClick={onSort('district,-created_at')}
              >
                {configuration.language.district} {renderChevron('district')}
              </ThArea>
            ) : (
              <ThArea
                data-testid="sortStadsdeel"
                onClick={onSort('stadsdeel,-created_at')}
              >
                Stadsdeel {renderChevron('stadsdeel')}
              </ThArea>
            )}
            <Th
              data-testid="sortAddress"
              onClick={onSort('address,-created_at')}
            >
              Adres {renderChevron('address')}
            </Th>
            {configuration.featureFlags.assignSignalToEmployee && (
              <Th
                data-testid="sortAssigedUserEmail"
                onClick={onSort('assigned_user_email,-created_at')}
              >
                Toegewezen aan {renderChevron('assigned_user_email')}
              </Th>
            )}
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => {
            const detailLink = `/manage/incident/${incident.id}`
            return (
              <tr key={incident.id}>
                <Td detailLink={detailLink}>
                  {incident.has_children && <ParentIncidentIcon />}
                  {incident.has_parent && <ChildIcon />}
                </Td>
                <Td detailLink={detailLink}>
                  {getListIconByKey(priority, incident.priority?.priority)}
                </Td>
                <Td detailLink={detailLink}>{incident.id}</Td>
                <Td detailLink={detailLink} data-testid="incidentDaysOpen">
                  {getDaysOpen(incident)}
                </Td>
                <Td detailLink={detailLink}>
                  {string2date(incident.created_at)}{' '}
                  {string2time(incident.created_at)}
                </Td>
                <Td detailLink={detailLink}>{incident.category?.sub}</Td>
                <Td detailLink={detailLink}>
                  {getListValueByKey(status, incident.status?.state)}
                </Td>
                <Td detailLink={detailLink}>
                  {configuration.featureFlags.fetchDistrictsFromBackend
                    ? getListValueByKey(districts, incident.location?.area_code)
                    : getListValueByKey(
                        stadsdeel,
                        incident.location?.stadsdeel
                      )}
                </Td>
                <Td detailLink={detailLink}>
                  {incident.location.address &&
                    formatAddress(incident.location.address)}
                </Td>
                {configuration.featureFlags.assignSignalToEmployee && (
                  <Td detailLink={detailLink}>
                    {incident.assigned_user_email}
                  </Td>
                )}
              </tr>
            )
          })}
        </tbody>
      </Table>
    </StyledList>
  )
}

export default List
