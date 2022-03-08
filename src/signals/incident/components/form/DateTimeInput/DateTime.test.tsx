import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withAppContext } from 'test/utils'

import DateTime, {
  defaultTimestamp,
  daysOptions,
  hoursOptions,
  minutesOptions,
} from './DateTime'

const onUpdate = jest.fn()
const props = {
  onUpdate,
  value: null,
}

describe('DateTime', () => {
  afterEach(() => {
    onUpdate.mockReset()
  })

  it('renders', () => {
    render(withAppContext(<DateTime {...props} />))

    expect(screen.getAllByRole('radio')).toHaveLength(2)
    expect(screen.getByLabelText('Nu')).toBeChecked()
  })

  it('renders more options', () => {
    const today = new Date()
    today.setHours(10)
    today.setMinutes(35)

    render(withAppContext(<DateTime {...props} value={today.getTime()} />))

    expect(
      screen.getByRole('combobox', { name: 'Welke dag was het?' })
    ).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'uur' })).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: 'minuten' })
    ).toBeInTheDocument()

    expect(screen.getByRole('combobox', { name: 'uur' })).toHaveValue('10')
    expect(screen.getByRole('combobox', { name: 'minuten' })).toHaveValue('35')
  })

  it('renders more options on selecting the earlier option', () => {
    render(withAppContext(<DateTime {...props} />))

    expect(
      screen.queryByRole('combobox', { name: 'Welke dag was het?' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('combobox', { name: 'uur' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('combobox', { name: 'minuten' })
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByLabelText('Eerder'))

    expect(
      screen.getByRole('combobox', { name: 'Welke dag was het?' })
    ).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'uur' })).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: 'minuten' })
    ).toBeInTheDocument()

    userEvent.click(screen.getByLabelText('Nu'))

    expect(
      screen.queryByRole('combobox', { name: 'Welke dag was het?' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('combobox', { name: 'uur' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('combobox', { name: 'minuten' })
    ).not.toBeInTheDocument()
  })

  it('calls onUpdate for both date indication options', () => {
    render(withAppContext(<DateTime {...props} />))

    expect(onUpdate).not.toHaveBeenCalled()

    userEvent.click(screen.getByLabelText('Eerder'))

    expect(onUpdate).toHaveBeenCalledWith(defaultTimestamp.getTime())

    userEvent.click(screen.getByLabelText('Nu'))

    expect(onUpdate).toHaveBeenCalledTimes(2)
    expect(onUpdate).toHaveBeenLastCalledWith(null)
  })

  it('calls onUpdate on selecting day', () => {
    render(withAppContext(<DateTime {...props} />))

    userEvent.click(screen.getByLabelText('Eerder'))

    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenCalledWith(defaultTimestamp.getTime())

    const index = 2

    userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Welke dag was het?' }),
      screen.getByRole('option', { name: daysOptions[index].name })
    )

    const daysInMs = 24 * index * 60 * 60 * 1000
    const selectedDate = new Date(defaultTimestamp.getTime() - daysInMs)
    selectedDate.setHours(defaultTimestamp.getHours())
    selectedDate.setMinutes(defaultTimestamp.getMinutes())
    selectedDate.setSeconds(defaultTimestamp.getSeconds())
    selectedDate.setMilliseconds(0)

    expect(onUpdate).toHaveBeenCalledTimes(2)
    expect(onUpdate).toHaveBeenLastCalledWith(selectedDate.getTime())
  })

  it('calls onUpdate on selecting hours', () => {
    render(withAppContext(<DateTime {...props} />))

    userEvent.click(screen.getByLabelText('Eerder'))

    expect(onUpdate).toHaveBeenCalledTimes(1)

    const hoursOption = hoursOptions[1] // 1 uur

    userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'uur' }),
      screen.getByRole('option', { name: hoursOption.name })
    )

    const diff = defaultTimestamp.getHours() - parseInt(hoursOption.value, 10)
    const diffInMs = diff * 60 * 60 * 1000

    expect(onUpdate).toHaveBeenCalledTimes(2)
    expect(onUpdate).toHaveBeenLastCalledWith(
      defaultTimestamp.getTime() - diffInMs
    )
  })

  it('calls onUpdate on selecting minutes', () => {
    render(withAppContext(<DateTime {...props} />))

    userEvent.click(screen.getByLabelText('Eerder'))

    expect(onUpdate).toHaveBeenCalledTimes(1)

    const minutesOption = minutesOptions[5] // 25 minutes

    userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'minuten' }),
      screen.getByRole('option', { name: minutesOption.name })
    )

    const diff =
      defaultTimestamp.getMinutes() - parseInt(minutesOption.value, 10)
    const diffInMs = diff * 60 * 1000

    expect(onUpdate).toHaveBeenCalledTimes(2)
    expect(onUpdate).toHaveBeenLastCalledWith(
      defaultTimestamp.getTime() - diffInMs
    )
  })
})
