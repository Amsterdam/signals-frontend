// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import PropTypes from 'prop-types'
import isObject from 'lodash/isObject'
import { themeColor, RadioGroup } from '@amsterdam/asc-ui'

import FormField from '../FormField'
import RadioInput from '../RadioInput'

const Info = styled.p`
  color: ${themeColor('tint', 'level5')};
`

const StyledRadioGroup = styled(RadioGroup)`
  margin-top: -6px; // Offset spacing introduced by asc-ui RadioGroup
`

const RadioInputGroup = ({
  handler,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) => {
  const currentSelected =
    parent.meta.incident && parent.meta.incident[meta.name]
  let info
  let label

  if (currentSelected && meta.values && meta.values[currentSelected.id]) {
    ;({ info, value: label } = meta.values[currentSelected.id])
  }

  if (!meta.isVisible) return null

  return (
    <FormField
      isFieldSet
      meta={meta}
      options={validatorsOrOpts}
      hasError={hasError}
      getError={getError}
    >
      {meta.values && isObject(meta.values) && (
        <div>
          <StyledRadioGroup
            id={meta.name}
            name={meta.name}
            aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
          >
            {Object.entries(meta.values).map(([key, value]) => (
              <RadioInput
                checked={handler().value?.id === key}
                id={key}
                idAttr={`${meta.name}-${key}`}
                info={value.info}
                key={key}
                label={value.value || value}
                name={meta.name}
                resetsStateOnChange={meta.resetsStateOnChange}
              />
            ))}
          </StyledRadioGroup>
          {info && (
            <Info data-testid={`${meta.name}--info`}>
              {label}: {info}
            </Info>
          )}
        </div>
      )}
    </FormField>
  )
}

RadioInputGroup.propTypes = {
  handler: PropTypes.func,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object,
}

export default RadioInputGroup
