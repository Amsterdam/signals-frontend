// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import styled from 'styled-components'
import { RadioGroup, Label } from '@amsterdam/asc-ui'

import RadioButton from 'components/RadioButton'

const FilterGroup = styled.div`
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

interface RadioButtonOption extends Option {
  name?: string
}

interface RadioButtonListProps {
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
  onChange?: (groupName: string, option: RadioButtonOption) => void
  options: Option[]
  /** Group label contents */
  title?: string
  className?: string
}

/**
 * Component that renders a group of radio buttons
 */
const RadioButtonList: FunctionComponent<RadioButtonListProps> = ({
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
  ...rest
}) => {
  const radioOptions: RadioButtonOption[] = [...options]

  if (hasEmptySelectionButton && emptySelectionLabel) {
    radioOptions.unshift({
      key: '',
      name: `${groupName}-empty`,
      value: emptySelectionLabel,
    })
  }

  return (
    <FilterGroup className={className}>
      {title && <Label data-testid="radioButtonListTitle" label={title} />}

      <StyledRadioGroup
        name={groupName}
        disabled={disabled}
        error={error}
        role="radiogroup"
        id={id}
        {...rest}
      >
        {radioOptions.map((option) => (
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
                  onChange(groupName, option)
                }
              }}
              value={option.key}
            />
          </StyledLabel>
        ))}
      </StyledRadioGroup>
    </FilterGroup>
  )
}

export default RadioButtonList
