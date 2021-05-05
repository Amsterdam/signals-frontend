import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heading,
  Link as AscLink,
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
import type { Incident as IncidentType } from '../../IncidentDetail/types'
import Description from './Description'

interface IncidentDetailProps {
  incident: IncidentType
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
  ['Status gewijzigd naar: Heropend']: 'Toelichting bij Heropend',
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
  grid-gap: ${themeSpacing(5)};
  row-gap: ${themeSpacing(4)};
  width: 100%;
`
const IncidentStyle = styled.div`
  padding-top: ${themeSpacing(5)};
  padding-left: ${themeSpacing(8)};
`
const StyledLink = styled(AscLink)`
  margin-bottom: ${themeSpacing(4)};
  text-decoration: underline;

  :hover {
    cursor: pointer;
    & > * {
      color: ${themeColor('secondary')};
    }
  }
`

const Value = styled.span`
  color: ${themeColor('tint', 'level7')};
`

const IncidentDetail: FunctionComponent<IncidentDetailProps> = ({
  incident,
}) => {
  const storeDispatch = useDispatch()
  const { get, isSuccess, isLoading, data, error } = useFetch<History[]>()
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
      <>
        <div>
          <StyledLink forwardedAs={Link} to={`/manage/incident/${id}`}>
            <Heading as="h2" styleAs="h3">
              {`${isParent ? 'Hoofd' : 'Standaard'}melding ${id}`}
            </Heading>
          </StyledLink>
          <InfoStyle>
            <span>Gemeld op</span>
            <Value>{format(new Date(date), 'dd-MM-yyyy HH:mm')}</Value>
            <span>Subcategorie (verantwoordelijke afdeling) </span>
            <Value>{subcategory}</Value>
            <span>Status </span>
            <Value>{status}</Value>
          </InfoStyle>
          <Box>
            <Heading as="h3" styleAs="h4">
              Omschrijving
            </Heading>
            <Description description={description} />
          </Box>
        </div>
        {isLoading && <LoadingIndicator />}
        {history && !isLoading && (
          <>
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
    </IncidentStyle>
  )
}

export default IncidentDetail
