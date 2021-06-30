import { Heading, Row, themeSpacing, Column } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import { Color as GraphColor } from './components/BarGraph/BarGraph'
import BarGraph from './components/BarGraph'
import GraphDescription from './components/GraphDescription'

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(8)};
  margin-top: ${themeSpacing(6)};
`

const StyledColumn = styled(Column)`
  height: 100%;
`

const Signaling: FunctionComponent<RouteComponentProps> = () => {
  const dataPrimary = [
    { title: 'Boom - dood', value: 500 },
    { title: 'Put', value: 100 },
    { title: 'Geluidsoverlast', value: 750 },
    { title: 'Verkeerssituaties', value: 1000 },
    { title: 'Bouw/sloop', value: 900 },
    { title: 'over de max', value: 1400 },
    { title: 'Fietswrak', value: 250 },
    { title: 'Onderhuur', value: 10 },
    { title: 'afval', value: 1 },
  ]

  const titlePrimary = `Openstaande meldingen tot en met 2020`
  const descriptionPrimary = `Alle openstaande meldingen die tot en met 31-12-2020 zijn gemaakt waarbij de doorlooptijd 3x buiten de afhandeltermijn is.`
  const totalPrimary = 7234

  const dataSecondary = [
    { title: 'Boom - dood', value: 1024 },
    { title: 'Put', value: 140 },
    { title: 'Geluidsoverlast', value: 750 },
    { title: 'Verkeerssituaties', value: 1400 },
    { title: 'Bouw/sloop', value: 1900 },
    { title: 'over de max', value: 1550 },
    { title: 'Fietswrak', value: 550 },
    { title: 'Onderhuur', value: 190 },
    { title: 'afval', value: 40 },
    { title: 'Overig groen / water', value: 999 },
  ]

  const titleSecondary = `Verzoek tot heropenen tot en met Q1 2021`
  const descriptionSecondary = `Meldingen waarbij de melder voor 01-04-2021 een "verzoek tot heropenen" heeft gedaan.`
  const totalSecondary = 2355

  return (
    <>
      <Row>
        <StyledHeading>Signalering</StyledHeading>
      </Row>
      <Row>
        <StyledColumn span={6} wrap>
          <GraphDescription
            title={titlePrimary}
            description={descriptionPrimary}
            total={totalPrimary}
          />
          <BarGraph
            maxValue={1000}
            data={dataPrimary}
            color={GraphColor.Blue}
          />
        </StyledColumn>
        <StyledColumn span={6} wrap>
          <GraphDescription
            title={titleSecondary}
            description={descriptionSecondary}
            total={totalSecondary}
          />
          <BarGraph
            maxValue={1000}
            data={dataSecondary}
            color={GraphColor.Red}
          />
        </StyledColumn>
      </Row>
    </>
  )
}

export default Signaling
