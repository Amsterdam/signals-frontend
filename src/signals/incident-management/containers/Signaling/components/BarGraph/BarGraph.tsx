import { themeSpacing, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const VALUE_MARGIN = 70
const BAR_HEIGHT = 25

export enum Color {
  Blue,
  Red,
}

interface Data {
  description: string
  value: number
}

interface Props {
  data: Data[]
  maxValue?: number
  color: Color
}

const getColorValue = (color: Color) => {
  if (color === Color.Blue) {
    return themeColor('primary')
  }
  if (color === Color.Red) {
    return themeColor('secondary')
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ValueWrapper = styled.div`
  margin-bottom: ${themeSpacing(4)};
`

const Description = styled.div`
  margin-bottom: ${themeSpacing(2)};
  color: ${themeColor('tint', 'level6')};
`

const BarWrapper = styled.div`
  width: calc(100% - ${VALUE_MARGIN}px);
`

const Bar = styled.div<{ c: Color; outOfBounds: boolean }>`
  height: ${BAR_HEIGHT}px;
  background: ${({ c }) => getColorValue(c)};
  position: relative;

  &::before,
  &::after {
    content: '';
    display: ${({ outOfBounds }) => (outOfBounds ? 'block' : 'none')};
    height: 100%;
    width: 2px;
    background: ${({ c }) => getColorValue(c)};
    position: absolute;
  }

  &::before {
    right: -4px;
  }

  &::after {
    right: -8px;
  }
`

const Value = styled.strong`
  display: inline-block;
  position: absolute;
  right: -${themeSpacing(4)};
  transform: translateX(100%);
`

const BarGraph = (props: Props) => {
  const maxValue = props.data.reduce((max, x) => Math.max(max, x.value), 0)
  const graphMaxValue = Math.min(props.maxValue || maxValue, maxValue)

  const bars = props.data
    .sort(({ value: x }, { value: y }) => y - x)
    .map((data) => {
      const outOfBounds = data.value > graphMaxValue
      const ratio = outOfBounds ? 1 : data.value / graphMaxValue
      const width = `${ratio * 100}%`

      return (
        <ValueWrapper>
          <Description data-testid="description">
            {data.description}
          </Description>
          <BarWrapper>
            <Bar
              data-testid="bar"
              c={props.color}
              outOfBounds={outOfBounds}
              style={{ width }}
            >
              <Value data-testid="value">{data.value}</Value>
            </Bar>
          </BarWrapper>
        </ValueWrapper>
      )
    })

  return <Wrapper>{bars}</Wrapper>
}

export default BarGraph
