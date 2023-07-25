// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { Fragment, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { Label } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import Checkbox from 'components/Checkbox'

import TopicLabel from '../TopicLabel'

const FilterGroup = styled.div`
  contain: content;
  position: relative;

  & + & {
    margin-top: 30px;
  }
`

const Toggle = styled.label<{ indent: boolean }>`
  display: inline-block;
  color: rgb(0, 70, 153);
  margin-left: ${({ indent }) => indent && 2}0px;
  cursor: pointer;
  text-decoration: underline;
  font-size: 1rem;
  line-height: 20px;
  white-space: nowrap;
  position: relative;

  &:hover {
    color: rgb(236, 0, 0);
  }

  &:focus {
    background-color: rgb(254, 200, 19);
  }

  & input[type='checkbox'] {
    position: absolute;
    left: 0;
    top: 0;
    visibility: hidden;
  }
`

const Wrapper = styled.div<{ disabled: boolean }>`
  ${({ disabled }) =>
    disabled &&
    css`
      * {
        pointer-events: none;
      }
    `}
`
const setsAreEqual = (a: Set<any>, b: Set<any>) =>
  a.size === b.size && [...a].every((value) => b.has(value))

type Option = {
  disabled?: boolean
  id?: string | number
  key?: string
  slug?: string
  value: string
  topic?: string
}

export type CheckboxListProps<T = Option> = {
  boxWrapperKeyPrefix?: string
  className?: string
  /** List of keys for elements that need to be checked by default */
  defaultValue?: Array<T>
  /**
   * Unique group identifier. Is used to match against the values of the `prop` attribute in the `options` prop.
   * If a match is found, the entire group is checked. Do note that, despite the name, this prop is not used as
   * the `id` attribute for any of the checkboxes.
   */
  groupId?: string
  /** Name of the toggle field as it should appear in the form data */
  groupName?: string
  /** Value for the toggle field as it should appear in the form data */
  groupValue?: string
  /** When true, will show a toggle element */
  hasToggle?: boolean
  /** Value of the `name` attribute of the checkboxes */
  name: string
  /**
   * Callback function that is triggered when an individual checkbox is checked
   */
  onChange?: (groupName: string, options: Array<T>) => void
  /** Adds onSubmit capabilities */
  onSubmit?: (event: KeyboardEvent) => void
  /**
   * Callback function that is triggered when a toggle checkbox is checked
   */
  onToggle?: (groupName: string, allOptionsChecked: boolean) => void
  /**
   * Values to be rendered as checkbox elements
   * Note that either one of `id` or `key` values should be present in an options entry
   */
  options: Array<T>
  /** Group label contents */
  title?: ReactNode | null
  /** Text label for the group toggle in its untoggled state */
  toggleAllLabel?: string
  /** Text label for the group toggle in its toggled state */
  toggleNothingLabel?: string
}

const CheckboxList = <T extends Option>({
  boxWrapperKeyPrefix,
  className,
  defaultValue,
  groupId,
  groupName,
  groupValue,
  hasToggle,
  name,
  onChange,
  onToggle,
  onSubmit,
  options,
  title,
  toggleAllLabel,
  toggleNothingLabel,
}: CheckboxListProps<T>) => {
  /**
   * Tracking of boxes that have been checked
   */
  const [checked, setChecked] = useState(new Set(defaultValue))

  /**
   * Toggle selection indicator
   */
  const [toggled, setToggled] = useState(false)
  const numOptions = options.length

  /**
   * Verify if an option has been marked as checked
   */
  const isChecked = useCallback(
    (id, state = checked) => {
      if (id === undefined) return false

      for (const option of state) {
        if (option.id === id || option.key === id) {
          return true
        }
      }

      return false
    },
    [checked]
  )

  /**
   * Get one of the checked options
   *
   * @param {String} id - key to check for
   * @returns {Object}
   */
  const getChecked = useCallback(
    (id) => {
      let foundOption

      for (const option of checked) {
        if (option.id === id || option.key === id) {
          foundOption = option
        }
      }

      return foundOption
    },
    [checked]
  )

  /**
   * Get an entry from the `option` prop value
   *
   * @param {String} id - key to check for
   * @returns {(Object|undefined)}
   */
  const getOption = useCallback(
    // id is always a string, because it comes from an HTML data- attribute
    // cast the comparing value to a string to make sure that we're comparing the same things
    (id: string) =>
      options.find((option) => `${option.id}` === id || `${option.key}` === id),
    [options]
  )

  useEffect(() => {
    const wholeGroupChecked = isChecked(groupId) || checked.size === numOptions

    setToggled(wholeGroupChecked)

    if (!wholeGroupChecked) return

    const optionsSet = new Set(options)

    if (!setsAreEqual(optionsSet, checked)) {
      setChecked(optionsSet)
    }
    // no need for dependencies; only execute on mount
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const state = new Set(defaultValue)

    if (setsAreEqual(state, checked)) return

    const wholeGroupChecked =
      isChecked(groupId, state) || state.size === numOptions

    setToggled(wholeGroupChecked)

    const optionsSet = new Set(options)

    setChecked(wholeGroupChecked ? optionsSet : state)

    // don't need all dependencies; only execute when value of `defaultValue` prop changes
    // eslint-disable-next-line
  }, [defaultValue])

  /**
   * Removes option from or adds option to state
   */
  const handleIndividualCheck = useCallback(
    ({ target }) => {
      const { checked: targetIsChecked } = target

      // Firefox & Safari on Mac do not hold focus for non-input elements when clicked
      // Force focus so that 'Enter' will submit the current selection
      target.focus()

      setChecked((state) => {
        const modifiedState = new Set(state)

        if (targetIsChecked) {
          const option = getOption(target.dataset.id)
          option && modifiedState.add(option)
        } else {
          const option = getChecked(target.dataset.id)

          option && modifiedState.delete(option)
        }

        const allOptionsChecked = modifiedState.size === numOptions

        setToggled(allOptionsChecked)

        // in case that a list of options contains of only one item, we need to call the `onToggle`
        // callback function instead of the `onChange` callback unless the `onToggle` is undefined
        if (onToggle && allOptionsChecked) {
          onToggle(groupValue || name, allOptionsChecked)
        } else {
          const onChangeTimeout = global.setTimeout(() => {
            global.clearTimeout(onChangeTimeout)
            onChange && onChange(groupValue || name, [...modifiedState])
          }, 0)
        }

        return modifiedState
      })
    },
    [getChecked, getOption, groupValue, name, numOptions, onChange, onToggle]
  )

  /**
   * Checks or unchecks all options in state
   */
  const handleToggle = useCallback(() => {
    onToggle && onToggle(groupValue || name, !toggled)
    setChecked(new Set(toggled ? [] : options))
    setToggled(!toggled)
  }, [groupValue, name, onToggle, options, toggled])

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case ' ':
          // Space
          event.preventDefault()
          handleToggle()
          break

        case 'Enter':
          onSubmit && onSubmit(event)
          break

        default:
          break
      }
    },
    [handleToggle, onSubmit]
  )

  return (
    <FilterGroup className={className} data-testid="checkbox-list">
      {title}

      {hasToggle && (
        <Toggle
          indent={Boolean(title)}
          tabIndex={0}
          onClick={groupName ? undefined : handleToggle}
          onKeyDown={handleKeyDown}
        >
          {toggled ? toggleNothingLabel : toggleAllLabel}

          {groupName && (
            <input
              checked={toggled}
              data-id={groupId}
              name={groupName}
              onChange={handleToggle}
              type="checkbox"
              value={groupValue || name}
            />
          )}
        </Toggle>
      )}

      {options.map(({ id, key, slug, value: label, topic }, index) => {
        const uid = id || key
        const optionId = [boxWrapperKeyPrefix, name, uid]
          .filter(Boolean)
          .join('_')
        const value = slug || key
        const defaultOption = defaultValue?.find(
          (option) => option.id === id
        ) || { disabled: false }

        if (!uid) {
          return null
        }
        return (
          <Fragment key={optionId}>
            {options.findIndex((option) => option.topic === topic) === index &&
              topic && <TopicLabel>{topic}</TopicLabel>}
            <Wrapper disabled={defaultOption.disabled || false}>
              <Label
                htmlFor={optionId}
                label={label}
                disabled={defaultOption.disabled}
                noActiveState
              >
                <Checkbox
                  checked={isChecked(groupId) || isChecked(uid)}
                  data-id={uid}
                  data-testid={`checkbox-${optionId}`}
                  id={optionId}
                  name={name}
                  onChange={handleIndividualCheck}
                  type="checkbox"
                  value={value}
                />
              </Label>
            </Wrapper>
          </Fragment>
        )
      })}
    </FilterGroup>
  )
}

CheckboxList.defaultProps = {
  boxWrapperKeyPrefix: '',
  className: '',
  defaultValue: [],
  groupId: undefined,
  groupName: '',
  groupValue: '',
  hasToggle: false,
  onChange: /* istanbul ignore next*/ () => {},
  onToggle: undefined,
  onSubmit: /* istanbul ignore next*/ () => {},
  title: null,
  toggleAllLabel: 'Alles selecteren',
  toggleNothingLabel: 'Niets selecteren',
}

export default CheckboxList
