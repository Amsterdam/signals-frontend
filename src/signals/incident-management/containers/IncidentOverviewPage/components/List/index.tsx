// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import type { FunctionComponent, ReactNode } from 'react'
import { useContext } from 'react'

import { Play } from '@amsterdam/asc-assets'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import parseISO from 'date-fns/parseISO'
import { Link, useNavigate } from 'react-router-dom'

import ParentIncidentIcon from 'components/ParentIncidentIcon'
import configuration from 'shared/services/configuration/configuration'
import { formatAddress } from 'shared/services/format-address'
import {
  getListValueByKey,
  getListIconByKey,
} from 'shared/services/list-helpers/list-helpers'
import { string2date, string2time } from 'shared/services/string-parser'
import { statusList } from 'signals/incident-management/definitions'
import type {
  Status,
  Priority,
  Definition,
} from 'signals/incident-management/definitions/types'
import { INCIDENT_URL } from 'signals/incident-management/routes'
import type { IncidentListItem, IncidentList } from 'types/api/incident-list'

import {
  ContentSpan,
  Th,
  ThId,
  ThDay,
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
import IncidentManagementContext from '../../../../context'

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
interface TdProps {
  detailLink: string
  children: ReactNode
}

const Td = ({ detailLink, children, ...rest }: TdProps) => {
  return (
    <TdStyle {...rest}>
      <Link to={detailLink} tabIndex={-1}>
        <ContentSpan>{children}</ContentSpan>
      </Link>
    </TdStyle>
  )
}

const ChildIcon: FunctionComponent = () => (
  <StyledIcon aria-label="Deelmelding" data-testid="child-icon">
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
  const navigate = useNavigate()

  const navigateToIncident = (id: number) => {
    navigate(`${INCIDENT_URL}/${id}`)
  }

  return (
    <StyledList
      isLoading={isLoading}
      className={className}
      data-testid="incident-overview-list-component"
    >
      <Table cellSpacing="0">
        <thead>
          <tr>
            <ThParent />
            <ThPriority />
            <ThId>Id</ThId>
            <ThDay>Dag</ThDay>
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
                <Td detailLink={detailLink} data-testid="incident-parent">
                  {incident.has_children && <ParentIncidentIcon />}
                  {incident.has_parent && <ChildIcon />}
                </Td>
                <Td detailLink={detailLink} data-testid="incident-urgency">
                  <StyledIcon>
                    {getListIconByKey(priority, incident.priority?.priority)}
                  </StyledIcon>
                </Td>
                <Td detailLink={detailLink} data-testid="incident-id">
                  {incident.id}
                </Td>
                <Td detailLink={detailLink} data-testid="incident-days-open">
                  {getDaysOpen(incident)}
                </Td>
                <Td detailLink={detailLink} data-testid="incident-created-at">
                  {string2date(incident.created_at)}{' '}
                  {string2time(incident.created_at)}
                </Td>
                <Td detailLink={detailLink} data-testid="incident-subcategory">
                  {incident.category?.sub}
                </Td>
                <Td detailLink={detailLink} data-testid="incident-status">
                  {getListValueByKey(status, incident.status?.state)}
                </Td>
                <Td detailLink={detailLink} data-testid="incident-area">
                  {configuration.featureFlags.fetchDistrictsFromBackend
                    ? getListValueByKey(districts, incident.location?.area_code)
                    : getListValueByKey(
                        stadsdeel,
                        incident.location?.stadsdeel
                      )}
                </Td>
                <Td detailLink={detailLink} data-testid="incident-address">
                  {incident.location?.address &&
                    formatAddress(incident.location?.address)}
                </Td>
                {configuration.featureFlags.assignSignalToEmployee && (
                  <Td
                    detailLink={detailLink}
                    data-testid="incident-assigned-user"
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
