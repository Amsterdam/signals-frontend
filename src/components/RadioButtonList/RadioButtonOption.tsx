// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam

import { Fragment } from 'react'

import FormField from 'components/FormField'
import RadioButtonComponent from 'components/RadioButton'
import TextArea from 'components/TextArea'

import type { RadioButtonListProps } from './RadioButtonList'
import { StyledLabel } from './styled'
import type { RadioButtonOption as RadioButtonOptionType } from './types'
import TopicLabel from '../TopicLabel'

interface Props {
  defaultValue?: string
  formValidation: RadioButtonListProps['formValidation']
  groupName: RadioButtonListProps['groupName']
  index: number
  option: RadioButtonOptionType
  onChange: RadioButtonListProps['onChange']
  radioOptions: RadioButtonListProps['options']
}

export const RadioButtonOption = ({
  defaultValue,
  formValidation,
  groupName,
  index,
  option,
  onChange,
  radioOptions,
}: Props) => {
  let component = (
    <Fragment key={option.key || option.name}>
      <StyledLabel
        key={option.key || option.name}
        htmlFor={option.key || option.name}
        label={option.value}
      >
        <RadioButtonComponent
          data-testid={`${groupName}-${option.key || option.name}`}
          checked={option.key === defaultValue}
          id={option.key || (option.name as string)}
          onChange={() => {
            if (onChange) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              onChange(groupName, option)
            }
          }}
          value={option.key}
        />
      </StyledLabel>

      {option.open_answer &&
        formValidation &&
        formValidation.selectedRadioButton === option.value && (
          <FormField
            meta={{
              label: ``,
              name: option.name,
              subtitle: '',
            }}
            hasError={(errorType) =>
              formValidation.errors[`open_answer-${option.value}`]?.type ===
              errorType
            }
            getError={(errorType) =>
              formValidation.errors[`open_answer-${option.value}`]?.type ===
              errorType
            }
          >
            <TextArea
              {...formValidation.register(`open_answer-${option.value}`)}
              maxLength={1000}
              maxContentLength={1000}
              maxRows={5}
              name={option.name}
              onChange={(event) => {
                formValidation.setValue(
                  `open_answer-${option.value}`,
                  event.target.value
                )
                formValidation.trigger(`open_answer-${option.value}`)
              }}
              rows={2}
            />
          </FormField>
        )}
    </Fragment>
  )

  if (radioOptions.some((option) => option.topic)) {
    component = (
      <Fragment key={option.key || option.name + '-fragment'}>
        {radioOptions.findIndex((option2) => option2.topic === option.topic) ===
          index &&
          option.topic && <TopicLabel>{option.topic}</TopicLabel>}
        {component}
      </Fragment>
    )
  }
  return component
}
