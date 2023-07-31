// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { Fragment } from 'react'

import { RadioGroup, Label } from '@amsterdam/asc-ui'
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'
import styled from 'styled-components'

import FormField from 'components/FormField'
import RadioButton from 'components/RadioButton'
import TextArea from 'components/TextArea'

import TopicLabel from '../TopicLabel'

const FilterGroup = styled.div`
  contain: content;
  position: relative;

  & + & {
    margin-top: 30px;
  }
`

const StyledLabel = styled(Label)`
  align-self: baseline;

  * {
    font-weight: normal;
  }
`

const StyledRadioGroup = styled(RadioGroup)`
  display: inline-flex;
`

interface Option {
  key: string
  value: string
}

export interface RadioButtonOption extends Option {
  name?: string
  topic?: string
  open_answer?: boolean
}

export interface RadioButtonListProps<T = RadioButtonOption> {
  /** List of keys for elements that need to be checked by default */
  defaultValue?: string
  /** When true, will disable all elements in the list */
  disabled?: boolean
  error?: boolean
  /** Text label for the radio button with the empty value */
  emptySelectionLabel?: string
  /**
   * Value of the `name` attribute of the toggle box. This value is used to identify all children by without having
   * to select them all.
   */
  groupName: string
  /** When false, will only render the passed in options instead of having an extra radio button with an empty value */
  hasEmptySelectionButton?: boolean
  id?: string
  onChange?: (groupName: string, option: T) => void
  options: Option[]
  /** Group label contents */
  title?: string
  className?: string
  /** Used to validate open answers with React Hook Forms */
  formValidation?: {
    selectedRadioButton: string
    errors: FieldErrors
    trigger: UseFormTrigger<any>
    setValue: UseFormSetValue<any>
    register: UseFormRegister<any>
  }
}

/**
 * Component that renders a group of radio buttons
 */
const RadioButtonList = <T extends RadioButtonOption>({
  className,
  emptySelectionLabel = 'Alles',
  hasEmptySelectionButton = true,
  defaultValue = '',
  disabled = false,
  error = false,
  groupName,
  onChange,
  options,
  title,
  id,
  formValidation,
  ...rest
}: RadioButtonListProps<T>) => {
  const radioOptions: RadioButtonOption[] = [...options]

  if (hasEmptySelectionButton && emptySelectionLabel) {
    radioOptions.unshift({
      key: '',
      name: `${groupName}-empty`,
      value: emptySelectionLabel,
    })
  }

  const renderRadioButton = (
    option: RadioButtonOption,
    index: number,
    formValidation: RadioButtonListProps['formValidation']
  ) => {
    let component = (
      <Fragment key={option.key || option.name}>
        <StyledLabel
          key={option.key || option.name}
          htmlFor={option.key || option.name}
          label={option.value}
        >
          <RadioButton
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
          {radioOptions.findIndex(
            (option2) => option2.topic === option.topic
          ) === index &&
            option.topic && <TopicLabel>{option.topic}</TopicLabel>}
          {component}
        </Fragment>
      )
    }
    return component
  }

  return (
    <FilterGroup className={className}>
      {title && <Label data-testid="radio-buttonlist-title" label={title} />}

      <StyledRadioGroup
        name={groupName}
        disabled={disabled}
        error={error}
        role="radiogroup"
        id={id}
        {...rest}
      >
        {radioOptions.map((option, index) =>
          renderRadioButton(option, index, formValidation)
        )}
      </StyledRadioGroup>
    </FilterGroup>
  )
}

export default RadioButtonList
