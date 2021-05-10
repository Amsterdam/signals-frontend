// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import map from 'lodash.map'
import isObject from 'lodash.isobject'
import { Label } from '@amsterdam/asc-ui'

import Checkbox from 'components/Checkbox'

import styled from 'styled-components'
import FormField from '../FormField'

function updateIncidentCheckboxMulti(
  checked,
  value,
  key,
  oldValue,
  meta,
  parent
) {
  let output = [...oldValue]
  if (checked) {
    output.push({
      id: key,
      label: value,
    })
  } else {
    output = output.filter((item) => item.id !== key)
  }

  parent.meta.updateIncident({ [meta.name]: output })
}

const CheckboxWrapper = styled.div`
  & > :first-child {
    margin-top: -6px; /* This margin enforces the 12px design distance from the title description */
  }
`

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const CheckboxInput = ({
  handler,
  touched,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) =>
  meta.isVisible && (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      touched={touched}
      hasError={hasError}
      getError={getError}
    >
      <CheckboxWrapper>
        {isObject(meta.values) ? (
          <CheckboxGroup role="group" id={meta.name}>
            <input type="hidden" {...handler()} />

            {map(meta.values, (value, key) => (
              <Label
                htmlFor={`${meta.name}-${key + 1}`}
                label={value}
                key={`${meta.name}-${key + 1}`}
                noActiveState
              >
                <Checkbox
                  id={`${meta.name}-${key + 1}`}
                  name={`${meta.name}-${key + 1}`}
                  value={key}
                  checked={(handler().value || []).find(
                    (item) => item.id === key
                  )}
                  onClick={(event) =>
                    updateIncidentCheckboxMulti(
                      event.target.checked,
                      value,
                      key,
                      handler().value,
                      meta,
                      parent
                    )
                  }
                />
              </Label>
            ))}
          </CheckboxGroup>
        ) : (
          <Label htmlFor={meta.name} label={meta.value} noActiveState>
            <Checkbox
              id={meta.name}
              name={meta.name}
              checked={handler().value.value}
              onClick={(e) => {
                parent.meta.updateIncident({
                  [meta.name]: {
                    label: meta.value,
                    value: e.target.checked,
                  },
                })
              }}
            />
          </Label>
        )}
      </CheckboxWrapper>
    </FormField>
  )

CheckboxInput.defaultProps = {
  hasError: () => {},
}

CheckboxInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func,
  hasError: PropTypes.func,
  meta: PropTypes.object.isRequired,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object,
}

export default CheckboxInput
