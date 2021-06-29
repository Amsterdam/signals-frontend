import { Heading, Row, themeSpacing, Column } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Color as GraphColor } from './components/BarGraph/BarGraph'
import BarGraph from './components/BarGraph'

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(8)};
  margin-top: ${themeSpacing(6)};
`

const Signaling: FunctionComponent = () => {
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

  return (
    <Row>
      <StyledHeading>Signalering</StyledHeading>
      <Column span={12}>
        <BarGraph maxValue={1000} data={dataPrimary} color={GraphColor.Blue} />
        <BarGraph maxValue={1000} data={dataSecondary} color={GraphColor.Red} />
      </Column>
    </Row>
  )
}

export default Signaling
