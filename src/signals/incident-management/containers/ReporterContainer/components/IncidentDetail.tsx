import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import {
  Heading,
  Link,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { format } from 'date-fns'
import configuration from 'shared/services/configuration/configuration'
import { makeSelectSubCategories } from 'models/categories/selectors'
import { useFetch } from 'hooks'
import LoadingIndicator from 'components/LoadingIndicator'
import { useDispatch, useSelector } from 'react-redux'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import { showGlobalNotification } from 'containers/App/actions'
import { Incident } from '../types'
import Description from './Description'

interface IncidentDetailProps {
  incident: Incident
}

interface History {
  identifier: string
  what: string
  when: Date
  who: string
  action: string
  description: string
}

const headerMapper: Record<string, string> = {
  ['Feedback van melder ontvangen']: 'Feedback',
  ['Status gewijzigd naar: Afgehandeld']: 'Toelichting bij Afgehandeld',
  ['Status gewijzigd naar: Heropened']: 'Toelichting bij Heropened',
}

const Box = styled.div`
  margin-bottom: ${themeSpacing(6)};
  white-space: pre-line;
`
const DescriptionStyle = styled(Paragraph)`
  font-size: 16px;
  line-height: ${themeSpacing(6)};
`
const InfoStyle = styled(DescriptionStyle)`
  color: ${themeColor('tint', 'level5')};
  display: grid;
  grid: auto-flow / 1fr 1fr;
  grid-gap: ${themeSpacing(1)};
  width: 100%;
`
const IncidentStyle = styled.div`
  width: 50%;
  border-left: 1px solid ${themeColor('tint', 'level3')};
  padding-top: ${themeSpacing(5)};
  padding-left: ${themeSpacing(8)};
`
const StyledLink = styled(Link)`
  margin-bottom: ${themeSpacing(4)};
  text-decoration: underline;

  :hover {
    cursor: pointer;
    & > * {
      color: ${themeColor('secondary')};
    }
  }
`
const IncidentDetail: FunctionComponent<IncidentDetailProps> = ({
  incident,
}) => {
  const storeDispatch = useDispatch()
  const { get, isLoading, isSuccess, data, error } = useFetch<History[]>()
  const subcategories = useSelector(makeSelectSubCategories)
  const {
    id,
    description,
    date,
    status,
    subcategory,
    isParent,
  } = useMemo(() => {
    const {
      id,
      created_at: date,
      text: description,
      category: { sub_slug },
      status: { state_display: status },
    } = incident
    const subcategory = subcategories?.find((s: any) => s.slug === sub_slug)
      .extendedName

    return {
      id,
      description,
      date,
      status,
      subcategory,
      isParent: !!incident._links?.['sia:children'],
    }
  }, [incident, subcategories])
  const [history, setHistory] = useState<History[]>()

  useEffect(() => {
    get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`)
  }, [id, get])

  useEffect(() => {
    if (!data) return
    setHistory(data)
  }, [isSuccess, data, history, setHistory])

  useEffect(() => {
    if (error) {
      storeDispatch(
        showGlobalNotification({
          title:
            'De data kon niet opgehaald worden. probeer het later nog eens.',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [error, storeDispatch])

  return (
    <IncidentStyle>
      {incident && (
        <>
          <div>
            <StyledLink href={`/manage/incident/${id}`}>
              <Heading as="h2" styleAs="h3">
                {`${isParent ? 'Hoofd' : 'Standaard'}melding ${id}`}
              </Heading>
            </StyledLink>
            <InfoStyle>
              <span>Gemeld op</span>
              <span>{format(new Date(date), 'dd-MM-yyyy HH:mm')}</span>
              <span>Subcategorie (verantwoordelijke afdeling) </span>
              <span>{subcategory}</span>
              <span>Status </span>
              <span>{status}</span>
            </InfoStyle>
            <Box>
              <Heading as="h3" styleAs="h4">
                Omschriving
              </Heading>
              <Description description={description} />
            </Box>
          </div>
          {history && (
            <>
              {isLoading && <LoadingIndicator />}
              {history
                .filter(({ action }) => {
                  return Object.keys(headerMapper).includes(action)
                })
                .map(({ description, identifier, action, what }) => {
                  return (
                    <Box key={identifier}>
                      <Heading as="h3" styleAs="h4">
                        {headerMapper[action]}
                      </Heading>
                      <Description what={what} description={description} />
                    </Box>
                  )
                })}
            </>
          )}
        </>
      )}
    </IncidentStyle>
  )
}

export default IncidentDetail
