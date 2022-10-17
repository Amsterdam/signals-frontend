import { useCallback, useEffect, useState } from 'react'
import type { FC } from 'react'

import { Label, RadioGroup } from '@amsterdam/asc-ui'
import Radio from 'components/RadioButton'
import Select from 'components/Select'
import format from 'date-fns/format'
import locale from 'date-fns/locale/nl'
import parse from 'date-fns/parse'
import subDays from 'date-fns/subDays'
import { capitalize } from 'shared/services/date-utils'
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

const getFormattedDate = (date: Date) =>
  capitalize(format(date, 'EEEE d MMMM', { locale }))

type FormattedDate = 'Vandaag' | ReturnType<typeof getFormattedDate>

const formatDate = (
  offset: number,
  type: 'label' | 'value' = 'value'
): FormattedDate => {
  if (type === 'label' && offset === 0) {
    return 'Vandaag'
  }

  const date = subDays(new Date(), offset)

  return getFormattedDate(date)
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

type DateIndication = DateIndicator['id'] | ''

const dateIndicationValue: Record<string, DateIndication> = {
  undefined: '',
  object: 'now',
  number: 'earlier',
}

const DateTime: FC<DateTimeProps> = ({ onUpdate, value }) => {
  const [datetime, setDatetime] = useState(
    value ? new Date(value) : defaultTimestamp
  )

  const [dateIndication, setDateIndication] = useState<DateIndication>(
    getDateIndication(value)
  )

  function getDateIndication(value: Incident['timestamp']): DateIndication {
    if (!value) return ''
    return dateIndicationValue[typeof value]
  }

  const updateTimestamp = useCallback(
    (event) => {
      const { name, value: targetValue } = event.target
      const cloned = new Date(datetime)
      switch (name) {
        case 'day': {
          const dateStr = `${targetValue} ${cloned.getFullYear()}`
          const parsedDate = parse(dateStr, 'EEEE d MMMM yyyy', datetime, {
            locale,
          })
          parsedDate.setHours(cloned.getHours())
          parsedDate.setMinutes(cloned.getMinutes())

          cloned.setTime(parsedDate.getTime())

          break
        }

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

  useEffect(() => {
    setDateIndication(getDateIndication(value))
  }, [value])
  return (
    <>
      <RadioGroup>
        {Object.values(dateIndicators).map(({ id, label }) => {
          return (
            <Label key={id} label={label} noActiveState>
              <Radio
                checked={id === dateIndication}
                id={id}
                name="dateIndicator"
                onChange={() => updateIndication(id)}
                value={id}
              />
            </Label>
          )
        })}
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
                value={getFormattedDate(datetime)}
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
