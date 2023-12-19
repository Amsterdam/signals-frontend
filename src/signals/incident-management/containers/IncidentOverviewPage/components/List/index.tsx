// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import type { FunctionComponent, ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { Play } from '@amsterdam/asc-assets'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import parseISO from 'date-fns/parseISO'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import ParentIncidentIcon from 'components/ParentIncidentIcon'
import configuration from 'shared/services/configuration/configuration'
import { formatAddress } from 'shared/services/format-address'
import {
  getListIconByKey,
  getListValueByKey,
} from 'shared/services/list-helpers/list-helpers'
import { string2date, string2time } from 'shared/services/string-parser'
import { statusList } from 'signals/incident-management/definitions'
import type {
  Definition,
  Priority,
  Status,
} from 'signals/incident-management/definitions/types'
import { INCIDENT_URL } from 'signals/incident-management/routes'
import type { IncidentList, IncidentListItem } from 'types/api/incident-list'
import onButtonPress from 'utils/on-button-press'

import {
  BaseTh,
  ContentSpan,
  StyledIcon,
  StyledList,
  Table,
  TdStyle,
  Th,
  ThArea,
  ThDate,
  ThDay,
  ThId,
  ThParent,
  ThPriority,
  ThStatus,
  ThSubcategory,
  Tr,
} from './styles'
import { useIncidentManagementContext } from '../../../../context'
import { SortOptionLabels, SortOptions } from '../../contants'
import { compareSortOptions } from '../../utils'
import ThSort from '../Th'

export const getDaysOpen = (incident: IncidentListItem) => {
  const statusesWithoutDaysOpen = statusList
    .filter(({ shows_remaining_sla_days }) => !shows_remaining_sla_days)
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
  orderingChangedAction: (ordering: string) => void
  ordering?: SortOptions
  sortingDisabled?: boolean
  lastIncident?: number
}

const List: FunctionComponent<ListProps> = ({
  className,
  incidents,
  isLoading = false,
  priority,
  stadsdeel,
  status,
  ordering,
  orderingChangedAction,
  sortingDisabled = false,
}) => {
  const { districts } = useIncidentManagementContext()
  const navigate = useNavigate()
  const location = useLocation()

  const [lastId, setLastId] = useState(13244)

  useEffect(() => {
    setLastId(location.pathname.split('/').pop())
  }, [location])

  const navigateToIncident = (id: number) => {
    navigate(`../${INCIDENT_URL}/${id}`)
  }

  /**
   * This method reverses the ordering if the column is already ordered
   * otherwise it will order the new column ascending
   * @param column
   */
  const changeOrder = (column: SortOptions) => {
    if (ordering && compareSortOptions(ordering, column)) {
      if (ordering.startsWith('-')) {
        orderingChangedAction(ordering.replace('-', ''))
      } else {
        orderingChangedAction(`-${ordering}`)
      }
    } else {
      orderingChangedAction(column)
    }
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
            <ThSort
              StyledComponent={ThPriority}
              sortOption={SortOptions.PRIORITY_ASC}
              headerText={SortOptionLabels.URGENTIE}
              ordering={ordering}
              changeOrder={changeOrder}
              sortingDisabled={sortingDisabled}
            />
            <ThSort
              StyledComponent={ThId}
              sortOption={SortOptions.ID_DESC}
              headerText={SortOptionLabels.ID}
              ordering={ordering}
              changeOrder={changeOrder}
              sortingDisabled={sortingDisabled}
            />
            <ThDay $isDisabled={true}>Dag</ThDay>
            <ThSort
              StyledComponent={ThDate}
              sortOption={SortOptions.CREATED_AT_DESC}
              headerText={SortOptionLabels.DATUM}
              ordering={ordering}
              changeOrder={changeOrder}
            />
            <ThSort
              StyledComponent={ThSubcategory}
              sortOption={SortOptions.SUBCATEGORY_ASC}
              headerText={SortOptionLabels.SUBCATEGORY}
              ordering={ordering}
              changeOrder={changeOrder}
              sortingDisabled={sortingDisabled}
            />
            <ThSort
              StyledComponent={ThStatus}
              sortOption={SortOptions.STATUS_ASC}
              headerText={SortOptionLabels.STATUS}
              ordering={ordering}
              changeOrder={changeOrder}
              sortingDisabled={sortingDisabled}
            />
            <ThSort
              StyledComponent={ThArea}
              sortOption={SortOptions.BUROUGH_ASC}
              headerText={
                configuration.featureFlags.fetchDistrictsFromBackend
                  ? configuration.language.district
                  : SortOptionLabels.STADSDEEL
              }
              ordering={ordering}
              changeOrder={changeOrder}
              sortingDisabled={sortingDisabled}
            />
            <ThSort
              StyledComponent={BaseTh}
              sortOption={SortOptions.ADDRESS_ASC}
              headerText={SortOptionLabels.ADRES}
              ordering={ordering}
              changeOrder={changeOrder}
              sortingDisabled={sortingDisabled}
            />
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
                onKeyDown={(e) => {
                  onButtonPress(e, () => navigateToIncident(incident.id))
                }}
                $lastIncident={incident.id === lastId}
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
