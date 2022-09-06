// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { RadioGroup, Label, themeSpacing } from '@amsterdam/asc-ui'

import InfoText from 'components/InfoText'
import Radio from 'components/RadioButton'
import type { ControllerRenderProps } from 'react-hook-form'

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: ${themeSpacing(6)};
`

const StyledLabel = styled(Label)`
  align-self: baseline;

  * {
    font-weight: normal;
  }
`

type Props = {
  display: string
  values: [{ key: string; value: string; info: string }]
  sort?: boolean
} & ControllerRenderProps

const RadioInput = ({
  name,
  display,
  values,
  sort,
  value: current,
  ...props
}: Props) => {
  let info
  let label
  const currentValue = values?.find(({ key }) => key === current)
  if (currentValue) {
    ;({ info, value: label } = currentValue)
  }

  return (
    <Wrapper>
      <div className="mode_input text rij_verplicht">
        {display && (
          <Label htmlFor={`form${name}`} label={<strong>{display}</strong>} />
        )}

        <RadioGroup name={name}>
          {values?.map(({ key, value }) => (
            <StyledLabel key={key} label={value}>
              <Radio
                checked={current === key}
                id={`${name}-${key}`}
                value={value}
                data-testid={`${name}-${key}`}
                onChange={() => {
                  props.onChange(key)
                }}
              />
            </StyledLabel>
          ))}
        </RadioGroup>

        {info && <InfoText text={`${label}: ${info}`} className={''} />}
      </div>
    </Wrapper>
  )
}

export default RadioInput
