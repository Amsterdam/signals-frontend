import { Heading, Row, themeSpacing, Column } from '@amsterdam/asc-ui'
import { FunctionComponent, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import useGetReportOpen from 'hooks/api/useGetReportOpen'
import useGetReportReopenRequested from 'hooks/api/useGetReportReopenRequested'
import { Report } from 'types/api/report'
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

const Signaling: FunctionComponent = () => {
  const endOpen = useMemo(() => new Date('2020-12-31').toISOString(), [])
  const {
    isLoading: openLoading,
    data: openData,
    error: errorOpen,
  } = useGetReportOpen({ end: endOpen })

  const endReopenRequested = useMemo(
    () => new Date('2021-04-01').toISOString(),
    []
  )
  const {
    isLoading: reopenRequestedLoading,
    data: reopenRequestedData,
    error: errorReopenRequested,
  } = useGetReportReopenRequested({ end: endReopenRequested })

  const getGraphDataFromReport = useCallback((report?: Report) => {
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
  }, [])

  const graphDataOpen = useMemo(
    () => getGraphDataFromReport(openData),
    [getGraphDataFromReport, openData]
  )
  const totalOpen = useMemo(
    () => (openData ? openData.total_signal_count : null),
    [openData]
  )

  const graphDataReopenRequested = useMemo(
    () => getGraphDataFromReport(reopenRequestedData),
    [getGraphDataFromReport, reopenRequestedData]
  )
  const totalReopenRequested = useMemo(
    () => (reopenRequestedData ? reopenRequestedData.total_signal_count : null),
    [reopenRequestedData]
  )

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
      <Row>
        <StyledColumn span={6} wrap>
          {totalOpen !== null ? (
            <GraphDescription
              title={`Openstaande meldingen tot en met 2020`}
              description={`
              Alle openstaande meldingen die 
              tot en met 31-12-2020 zijn gemaakt 
              waarbij de doorlooptijd 3x buiten de afhandeltermijn is.
            `}
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
          {totalReopenRequested !== null ? (
            <GraphDescription
              title={`Verzoek tot heropenen tot en met Q1 2021`}
              description={`
              Meldingen waarbij de melder voor 01-04-2021 
              een "verzoek tot heropenen" heeft gedaan.
            `}
              total={totalReopenRequested}
            />
          ) : null}

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
