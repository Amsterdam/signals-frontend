import { Heading, Row, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import styled from 'styled-components'

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(8)};
  margin-top: ${themeSpacing(6)};
`

const Signaling: FunctionComponent = () => {
  return (
    <Row>
      <StyledHeading>Signalering</StyledHeading>
      {/* <Column span={12}> */}
      {/* </Column> */}
    </Row>
  )
}

export default Signaling
