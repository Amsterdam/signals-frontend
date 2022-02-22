import { useCallback, useState } from 'react'
import format from 'date-fns/format'
import subDays from 'date-fns/subDays'
import nl from 'date-fns/locale/nl'
import { Label, RadioGroup } from '@amsterdam/asc-ui'

import type { FC } from 'react'

import { capitalize } from 'shared/services/date-utils'
import Select from 'components/Select'
import Radio from 'components/RadioButton'

import type { Incident } from 'types/incident'
import {
  FieldWrapper,
  Info,
  StyledLabel,
  TimeFieldset,
  TimeWrapper,
} from './styled'

type DateIndicator = {
  id: 'now' | 'earlier'
  label: 'Nu' | 'Eerder'
}

const dateIndicators: DateIndicator[] = [
  {
    id: 'now',
    label: 'Nu',
  },
  {
    id: 'earlier',
    label: 'Eerder',
  },
]

export const defaultTimestamp = new Date()
defaultTimestamp.setHours(9)
defaultTimestamp.setMinutes(0)
defaultTimestamp.setSeconds(0)

const dateFormat = {
  label: 'eeee d MMMM',
  value: 'dd',
}

const formatDate = (offset: number, type: 'label' | 'value' = 'value') => {
  if (type === 'label' && offset === 0) {
    return 'Vandaag'
  }

  const date = subDays(new Date(), offset)

  return capitalize(format(date, dateFormat[type], { locale: nl }))
}

export const daysOptions = [...Array(7).keys()].map((offset) => {
  const name = formatDate(offset, 'label')

  return {
    key: name,
    name,
    value: formatDate(offset),
  }
})

export const hoursOptions = [...Array(24).keys()].map((value) => ({
  key: value.toString(),
  name: value.toString(),
  value: value.toString(),
}))

export const minutesOptions = [...Array(12).keys()].map((minute) => ({
  key: (minute * 5).toString(),
  name: (minute * 5).toString(),
  value: (minute * 5).toString(),
}))

export interface DateTimeProps {
  onUpdate: (timestamp: Incident['timestamp']) => void
  value: Incident['timestamp']
}

const DateTime: FC<DateTimeProps> = ({ onUpdate, value }) => {
  const [datetime, setDatetime] = useState(
    value ? new Date(value) : defaultTimestamp
  )

  const [dateIndication, setDateIndication] = useState<DateIndicator['id']>(
    typeof value === 'number' ? 'earlier' : 'now'
  )

  const updateTimestamp = useCallback(
    (event) => {
      const { name, value: targetValue } = event.target
      const cloned = new Date(datetime)

      switch (name) {
        case 'day':
          cloned.setDate(targetValue)
          break
        case 'hours':
          cloned.setHours(targetValue)
          break
        case 'minutes':
          cloned.setMinutes(targetValue)
          break
      }

      setDatetime(cloned)
      onUpdate(cloned.getTime())
    },
    [datetime, onUpdate]
  )

  const updateIndication = useCallback(
    (indication: DateIndicator['id']) => {
      setDateIndication(indication)

      if (indication === 'now') {
        const cloned = new Date()

        cloned.setHours(9)
        cloned.setMinutes(0)
        cloned.setSeconds(0)

        setDatetime(cloned)
        onUpdate(null)
      } else {
        setDatetime(defaultTimestamp)
        onUpdate(defaultTimestamp.getTime())
      }
    },
    [onUpdate]
  )

  return (
    <>
      <RadioGroup>
        {Object.values(dateIndicators).map(({ id, label }) => (
          <Label key={id} label={label} noActiveState>
            <Radio
              checked={id === dateIndication}
              id={id}
              name="dateIndicator"
              onChange={() => updateIndication(id)}
              value={id}
            />
          </Label>
        ))}
      </RadioGroup>

      {dateIndication === 'earlier' && (
        <>
          <TimeFieldset>
            <FieldWrapper>
              <StyledLabel htmlFor="day">Welke dag was het?</StyledLabel>
              <Select
                id="day"
                name="day"
                data-testid="selectDay"
                value={datetime.getDate().toString()}
                onChange={updateTimestamp}
                options={daysOptions}
              />
            </FieldWrapper>
          </TimeFieldset>

          <TimeFieldset>
            <legend>
              <StyledLabel>Hoe laat was het?</StyledLabel>
            </legend>

            <TimeWrapper>
              <div>
                <Select
                  id="hours"
                  aria-labelledby="uur"
                  name="hours"
                  data-testid="selectHours"
                  value={datetime.getHours().toString()}
                  onChange={updateTimestamp}
                  options={hoursOptions}
                />
              </div>
              <Info id="uur">uur</Info>
              <div>
                <Select
                  id="minutes"
                  name="minutes"
                  aria-labelledby="min"
                  data-testid="selectMinutes"
                  value={datetime.getMinutes().toString()}
                  onChange={updateTimestamp}
                  options={minutesOptions}
                />
              </div>
              <Info id="min" aria-label="minuten">
                min
              </Info>
            </TimeWrapper>
          </TimeFieldset>
        </>
      )}
    </>
  )
}

export default DateTime