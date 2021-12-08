import { Heading, Row, themeSpacing, Column } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import useGetReportOpen from 'hooks/api/useGetReportOpen'
import useGetReportReopenRequested from 'hooks/api/useGetReportReopenRequested'
import type { Report } from 'types/api/report'
import LoadingIndicator from 'components/LoadingIndicator'
import Notification from 'components/Notification'
import { Color as GraphColor } from './components/BarGraph/BarGraph'
import BarGraph from './components/BarGraph'
import GraphDescription from './components/GraphDescription'
import GraphEmpty from './components/GraphEmpty'

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(8)};
  margin-top: ${themeSpacing(6)};
`

const StyledColumn = styled(Column)`
  height: 100%;
  border-bottom: 2px solid;
  padding-bottom: ${themeSpacing(8)};

  @media (max-width: ${({ theme }) => theme.layouts.large.min}px) {
    margin-bottom: ${themeSpacing(8)};
  }
`

const endReopenRequestedDate = new Date()
const daysInThePast = 14
endReopenRequestedDate.setDate(endReopenRequestedDate.getDate() - daysInThePast)
const endReopenRequested = endReopenRequestedDate.toISOString()

const Signaling: FunctionComponent = () => {
  const {
    isLoading: openLoading,
    data: openData,
    error: errorOpen,
    get: getReportOpen,
  } = useGetReportOpen()

  const {
    isLoading: reopenRequestedLoading,
    data: reopenRequestedData,
    error: errorReopenRequested,
    get: getReportReopenRequested,
  } = useGetReportReopenRequested()

  useEffect(() => {
    getReportOpen()
    getReportReopenRequested({ end: endReopenRequested })
  }, [getReportOpen, getReportReopenRequested])

  const getGraphDataFromReport = (report?: Report) => {
    if (!report) return []

    return report.results.map(({ category, signal_count }) => {
      const item = {
        description: category.name,
        value: signal_count,
      }

      if (category.departments.length > 0) {
        item.description = `${category.name} (${category.departments.join(
          ', '
        )})`
      }

      return item
    })
  }

  const graphDataOpen = getGraphDataFromReport(openData)
  const totalOpen = openData ? openData.total_signal_count : null
  const graphDataReopenRequested = getGraphDataFromReport(reopenRequestedData)
  const totalReopenRequested = reopenRequestedData
    ? reopenRequestedData.total_signal_count
    : null

  const heading = (
    <Row>
      <StyledHeading data-testid="heading">Signalering</StyledHeading>
    </Row>
  )

  if (errorOpen || errorReopenRequested) {
    return (
      <Notification
        title="Er is iets misgegaan"
        message="De data kon niet worden opgehaald"
        variant="error"
      />
    )
  }

  if (openLoading || reopenRequestedLoading) {
    return (
      <>
        {heading}
        <LoadingIndicator />
      </>
    )
  }

  return (
    <>
      {heading}
      <Row data-testid="signaling">
        <StyledColumn span={6} wrap>
          {totalOpen !== null ? (
            <GraphDescription
              title="Buiten de afhandeltermijn"
              description="Alle openstaande meldingen, waarvan de doorlooptijd langer is dan 3x de afhandeltermijn."
              total={totalOpen}
            />
          ) : null}

          {totalOpen === 0 ? (
            <GraphEmpty text={'Hier is niks meer te signaleren'} />
          ) : (
            <BarGraph
              maxValue={1000}
              data={graphDataOpen}
              color={GraphColor.Red}
            />
          )}
        </StyledColumn>
        <StyledColumn span={6} wrap>
          {totalReopenRequested !== null && (
            <GraphDescription
              title="Verzoek tot heropenen"
              description={`Meldingen waarbij de melder langer dan 2 weken geleden een "verzoek tot heropenen" heeft gedaan.`}
              total={totalReopenRequested}
            />
          )}

          {totalReopenRequested === 0 ? (
            <GraphEmpty text={'Hier is niks meer te signaleren'} />
          ) : (
            <BarGraph
              maxValue={1000}
              data={graphDataReopenRequested}
              color={GraphColor.Blue}
            />
          )}
        </StyledColumn>
      </Row>
    </>
  )
}

export default Signaling
