import { render } from '@testing-library/react'
import { Color } from '../BarGraph'
import BarGraph from '../'

describe('BarGraph', () => {
  it('should render', () => {
    render(<BarGraph color={Color.Blue} data={[]} />)
  })

  it('should render a bar for each data point supplied', () => {
    const data = [
      { description: 'bar', value: 1 },
      { description: 'foo', value: 2 },
    ]

    const { getAllByTestId } = render(
      <BarGraph color={Color.Blue} data={data} />
    )

    const descriptions = getAllByTestId('description')
    const values = getAllByTestId('value')

    expect(descriptions.length).toBe(2)
    expect(descriptions[0].textContent).toBe('foo')
    expect(descriptions[1].textContent).toBe('bar')
    expect(values[0].textContent).toBe('2')
    expect(values[1].textContent).toBe('1')
  })

  it('should order bars based on their value', () => {
    const data = [
      { description: 'last', value: 1 },
      { description: 'middle', value: 2 },
      { description: 'first', value: 3 },
    ]

    const { getAllByTestId } = render(
      <BarGraph color={Color.Blue} data={data} />
    )

    const values = getAllByTestId('value')

    expect(values[0].textContent).toBe('3')
    expect(values[1].textContent).toBe('2')
    expect(values[2].textContent).toBe('1')
  })

  it('should render bars with the correct percentage width', () => {
    const data = [
      { description: 'foo', value: 10 },
      { description: 'bar', value: 40 },
      { description: 'lorem', value: 20 },
      { description: 'ipsum', value: 80 },
    ]

    const { getAllByTestId } = render(
      <BarGraph color={Color.Blue} data={data} />
    )

    const bars = getAllByTestId('bar')

    expect(bars[0].style.width).toBe('100%')
    expect(bars[1].style.width).toBe('50%')
    expect(bars[2].style.width).toBe('25%')
    expect(bars[3].style.width).toBe('12.5%')
  })

  it('should render bars with the correct percentage width if there is a maxValue set', () => {
    const data = [
      { description: 'foo', value: 10 },
      { description: 'bar', value: 40 },
      { description: 'lorem', value: 20 },
      { description: 'ipsum', value: 80 },
    ]

    const { getAllByTestId } = render(
      <BarGraph color={Color.Blue} data={data} maxValue={40} />
    )

    const bars = getAllByTestId('bar')

    expect(bars[0].style.width).toBe('100%')
    expect(bars[1].style.width).toBe('100%')
    expect(bars[2].style.width).toBe('50%')
    expect(bars[3].style.width).toBe('25%')
  })
})
