// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { KeyboardEvent } from 'react'
import type { FunctionComponent } from 'react'

import { themeSpacing } from '@amsterdam/asc-ui'
import Button from 'components/Button'
import FormField from 'components/FormField'
import Input from 'components/Input'
import map from 'lodash/map'
import styled from 'styled-components'
import type { FormInputProps, FormMeta, ParentType } from 'types/reactive-form'

const allowedChars = /[\d,.;]+/

const filterInvalidKeys = (event: KeyboardEvent<HTMLInputElement>) => {
  if (!allowedChars.test(event.key)) {
    // Swallow invalid character inputs.
    event.preventDefault()
  }
}

const updateIncident = (
  value: string,
  index: number,
  oldFields: string[],
  meta: FormMeta,
  parent: ParentType
) => {
  const fields = [...oldFields]
  fields[index] = value
  meta.name && parent.meta.updateIncident({ [meta.name]: fields })
}

function addItem(oldFields: string[], meta: FormMeta, parent: ParentType) {
  const fields = [...oldFields]

  if (!fields.length) {
    fields.push('')
  }

  fields.push('')
  meta.name && parent.meta.updateIncident({ [meta.name]: fields })
}

export const StyledInput = styled(Input)`
  margin-bottom: ${themeSpacing(2)};
  width: 25%;
  min-width: 175px;
`

export type MultiTextInputProps = FormInputProps<string[]>

/**
 * Multiple text input fields.
 * Text input is only for limited character set (see pattern and filterInvalidKeys handler).
 */
const MultiTextInput: FunctionComponent<MultiTextInputProps> = ({
  handler,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) =>
  (meta?.isVisible && (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      hasError={hasError}
      getError={getError}
    >
      <div>
        <input type="hidden" {...handler()} />

        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          map(
            (handler().value as string[]) || [''],
            (input: string, index: number) => (
              <div key={`${meta.name}-${index + 1}`}>
                <StyledInput
                  id={index === 0 ? meta.name : `${meta.name}-${index + 1}`}
                  aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
                  name={`${meta.name}-${index + 1}`}
                  type="text"
                  placeholder={meta.placeholder}
                  value={input}
                  onChange={(event) => {
                    updateIncident(
                      event.target.value,
                      index,
                      handler().value,
                      meta,
                      parent
                    )
                  }}
                  onKeyDown={(event) => {
                    filterInvalidKeys(event)
                  }}
                  pattern="[0-9.,;]+"
                  maxLength={15}
                />
              </div>
            )
          )
        }

        <Button
          onClick={() => {
            addItem(handler().value, meta, parent)
          }}
          variant="textButton"
        >
          {meta.newItemText}
        </Button>
      </div>
    </FormField>
  )) ||
  null

export default MultiTextInput
