// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam

import { Label } from '@amsterdam/asc-ui'
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'

import { RadioButtonOption } from './RadioButtonOption'
import { FilterGroup, StyledRadioGroup } from './styled'
import type { RadioButtonOption as RadioButtonOptionType } from './types'

export interface RadioButtonListProps<T = RadioButtonOptionType> {
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
  options: T[]
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
const RadioButtonList = <T extends RadioButtonOptionType>({
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
  const radioOptions: RadioButtonOptionType[] = [...options]

  if (hasEmptySelectionButton && emptySelectionLabel) {
    radioOptions.unshift({
      key: '',
      name: `${groupName}-empty`,
      value: emptySelectionLabel,
    })
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
        {radioOptions.map((option, index) => (
          <RadioButtonOption
            option={option}
            index={index}
            formValidation={formValidation}
            defaultValue={defaultValue}
            groupName={groupName}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onChange={onChange}
            radioOptions={options}
          />
        ))}
      </StyledRadioGroup>
    </FilterGroup>
  )
}

export default RadioButtonList
