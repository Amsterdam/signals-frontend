// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { FunctionComponent, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import parseISO from 'date-fns/parseISO'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { Play } from '@amsterdam/asc-assets'

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
import { INCIDENT_URL } from 'signals/incident-management/routes'
import IncidentManagementContext from '../../../../context'
import {
  ContentSpan,
  Th,
  TdStyle,
  ThArea,
  ThDate,
  ThParent,
  ThPriority,
  ThStatus,
  ThSubcategory,
  Tr,
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
    <Link to={detailLink} tabIndex={-1}>
      <ContentSpan>{children}</ContentSpan>
    </Link>
  </TdStyle>
)

const ChildIcon: FunctionComponent = () => (
  <StyledIcon aria-label="Deelmelding" data-testid="childIcon">
    <Play />
  </StyledIcon>
)

interface ListProps {
  className?: string
  incidents: IncidentList
  isLoading?: boolean
  priority: Priority[]
  stadsdeel: Definition[]
  status: Status[]
}

const List: FunctionComponent<ListProps> = ({
  className,
  incidents,
  isLoading = false,
  priority,
  stadsdeel,
  status,
}) => {
  const { districts } = useContext(IncidentManagementContext)
  const history = useHistory()

  const navigateToIncident = (id: number) => {
    history.push(`${INCIDENT_URL}/${id}`)
  }

  return (
    <StyledList
      isLoading={isLoading}
      className={className}
      data-testid="incidentOverviewListComponent"
    >
      <Table cellSpacing="0">
        <thead>
          <tr>
            <ThParent />
            <ThPriority />
            <Th>Id</Th>
            <Th>Dag</Th>
            <ThDate>Datum en tijd</ThDate>
            <ThSubcategory>Subcategorie</ThSubcategory>
            <ThStatus>Status</ThStatus>

            {configuration.featureFlags.fetchDistrictsFromBackend ? (
              <ThArea>{configuration.language.district}</ThArea>
            ) : (
              <ThArea>Stadsdeel</ThArea>
            )}

            <Th>Adres</Th>

            {configuration.featureFlags.assignSignalToEmployee && (
              <Th>Toegewezen aan</Th>
            )}
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => {
            const detailLink = `/manage/incident/${incident.id}`
            return (
              <Tr
                key={incident.id}
                tabIndex={0}
                onKeyPress={() => navigateToIncident(incident.id)}
              >
                <Td detailLink={detailLink} data-testid="incidentParent">
                  {incident.has_children && <ParentIncidentIcon />}
                  {incident.has_parent && <ChildIcon />}
                </Td>
                <Td detailLink={detailLink} data-testid="incidentUrgency">
                  <StyledIcon>
                    {getListIconByKey(priority, incident.priority?.priority)}
                  </StyledIcon>
                </Td>
                <Td detailLink={detailLink} data-testid="incidentId">
                  {incident.id}
                </Td>
                <Td detailLink={detailLink} data-testid="incidentDaysOpen">
                  {getDaysOpen(incident)}
                </Td>
                <Td detailLink={detailLink} data-testid="incidentCreatedAt">
                  {string2date(incident.created_at)}{' '}
                  {string2time(incident.created_at)}
                </Td>
                <Td detailLink={detailLink} data-testid="incidentSubcategory">
                  {incident.category?.sub}
                </Td>
                <Td detailLink={detailLink} data-testid="incidentStatus">
                  {getListValueByKey(status, incident.status?.state)}
                </Td>
                <Td detailLink={detailLink} data-testid="incidentArea">
                  {configuration.featureFlags.fetchDistrictsFromBackend
                    ? getListValueByKey(districts, incident.location?.area_code)
                    : getListValueByKey(
                        stadsdeel,
                        incident.location?.stadsdeel
                      )}
                </Td>
                <Td detailLink={detailLink} data-testid="incidentAddress">
                  {incident.location?.address &&
                    formatAddress(incident.location?.address)}
                </Td>
                {configuration.featureFlags.assignSignalToEmployee && (
                  <Td
                    detailLink={detailLink}
                    data-testid="incidentAssignedUser"
                  >
                    {incident.assigned_user_email}
                  </Td>
                )}
              </Tr>
            )
          })}
        </tbody>
      </Table>
    </StyledList>
  )
}

export default List
