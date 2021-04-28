import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { Heading, Paragraph, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { format } from 'date-fns'
import configuration from 'shared/services/configuration/configuration'
import { makeSelectSubCategories } from 'models/categories/selectors'
import { useFetch } from 'hooks'
import LoadingIndicator from 'components/LoadingIndicator'
import { useSelector } from 'react-redux'
import { Feedback, Incident } from '../types'
import FeedbackStatus from './FeedbackStatus'

const IncidentStyle = styled.div`
  width: 50%;
  border-left: 1px solid ${themeColor('tint', 'level3')};
  padding-top: ${themeSpacing(5)};
  padding-left: ${themeSpacing(8)};
`

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

const Description: FunctionComponent<{ what: string; description: string }> = ({
  what,
  description,
}) => {
  if (what === 'RECEIVE_FEEDBACK') {
    const descriptionList = description.split('\n')
    const feedback: Feedback = {
      submitted_at: '-',
      is_satisfied: descriptionList[0].startsWith('Ja'),
    }
    return (
      <>
        <FeedbackStatus feedback={feedback} />
        <DescriptionStyle>
          {descriptionList.slice(1).join('\n')}
        </DescriptionStyle>
      </>
    )
  }

  return <DescriptionStyle>{description}</DescriptionStyle>
}

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
  _signal: number
}

const IncidentDetail: FunctionComponent<IncidentDetailProps> = ({
  incident,
}) => {
  const { get, isLoading, isSuccess, data } = useFetch<History[]>()
  const subcategories = useSelector(makeSelectSubCategories)
  const { id, description, date, status, subcategory } = useMemo(() => {
    const {
      id,
      created_at: date,
      text: description,
      category: { sub_slug },
      status: { state_display: status },
    } = incident
    const subcategory = subcategories.find((s: any) => s.slug === sub_slug)
      .extendedName

    return { id, description, date, status, subcategory }
  }, [incident, subcategories])
  const [history, setHistory] = useState<History[]>()

  useEffect(() => {
    get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`)
  }, [id, get])

  useEffect(() => {
    if (!data) return
    setHistory(data)
  }, [isSuccess, data, history, setHistory])

  return (
    <IncidentStyle>
      {incident && (
        <>
          <div>
            <Box>Header Melding: {id}</Box>
            <InfoStyle>
              <span>Gemeld op: Melding</span>
              <span>{format(new Date(date), 'dd-MM-yyyy HH:mm')}</span>
              <span>Subcategorie (verantwoordelijke afdeling) </span>
              <span>{subcategory}</span>
              <span>Status </span>
              <span>{status}</span>
            </InfoStyle>
            <Box>
              <Heading as="h2" styleAs="h3">
                Omschriving
              </Heading>
              <div>{description}</div>
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
                      <Heading as="h2" styleAs="h3">
                        {headerMapper[action]}
                      </Heading>
                      <Description
                        what={what}
                        description={description}
                      ></Description>
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
