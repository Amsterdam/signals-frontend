// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { Fragment, useEffect, useState, useCallback, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import set from 'lodash/set'
import styled from 'styled-components'
import { themeSpacing } from '@amsterdam/asc-ui'

import Button from 'components/Button'
import { dataListType } from 'shared/types'
import {
  getListValueByKey,
  getListIconByKey,
} from 'shared/services/list-helpers/list-helpers'
import InfoText from 'components/InfoText'

import EditButton from '../EditButton'
import IncidentDetailContext from '../../context'

const DisplayValue = styled.span`
  color: ${({ hasHighPriority, theme }) =>
    hasHighPriority ? theme.colors.support.invalid : theme.colors.primary};
  font-weight: ${({ hasHighPriority }) => (hasHighPriority ? '700' : '400')};
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - ${themeSpacing(10)});
`

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: ${themeSpacing(1)};
`

const SaveButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
`

const ButtonBar = styled.div`
  margin-top: ${themeSpacing(6)};
`

const identity = (value) => value

const ChangeValue = ({
  component: FormComponent,
  disabled = false,
  display,
  infoKey = '',
  options,
  groups,
  patch = {},
  path,
  type,
  valueClass = '',
  valuePath = '',
  rawDataToKey = identity,
  keyToRawData = identity,
}) => {
  const { incident, update } = useContext(IncidentDetailContext)
  const [showForm, setShowForm] = useState(false)
  const [info, setInfo] = useState('')

  useEffect(() => setShowForm(false), [incident?.id])

  const { control, setValue, getValues, reset } = useForm()

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()

      const payload = { ...patch }
      const newValue = getValues().input || options.find(({ key }) => !key)?.key
      set(payload, path, keyToRawData(newValue))
      update({
        type,
        patch: { ...payload },
      })

      reset()
      setShowForm(false)
    },
    [patch, getValues, options, path, keyToRawData, update, type, reset]
  )

  const handleCancel = useCallback(() => {
    reset()
    setShowForm(false)
  }, [reset])

  const handleKeyUp = useCallback(
    (event) => {
      switch (event.key) {
        case 'Esc':
        case 'Escape':
          handleCancel()
          break

        default:
          break
      }
    },
    [handleCancel]
  )

  const handleChange = useCallback(
    (event) => {
      const { value } = event.target

      showInfo(value)
    },
    [showInfo]
  )

  const showInfo = useCallback(
    (value) => {
      if (infoKey) {
        const valueItem = options.find(({ key }) => key === value)

        if (valueItem) {
          setInfo(valueItem[infoKey])
        }
      }
    },
    [infoKey, options]
  )

  const onShowForm = useCallback(() => {
    const value = rawDataToKey(get(incident, valuePath || path))

    setValue('input', value)

    setShowForm(true)

    showInfo(value)
  }, [incident, rawDataToKey, valuePath, path, showInfo, setValue])

  useEffect(() => {
    setShowForm(false)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
    // Disabling linter; only execute on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const editForm = (
    <form
      onSubmit={handleSubmit}
      onChange={handleChange}
      data-testid="changeValueForm"
    >
      <Controller
        name="input"
        control={control}
        render={({ field: { onChange, value, name } }) => {
          return (
            <FormComponent
              name={name}
              display={display}
              onChange={onChange}
              groups={groups}
              value={value}
              values={options}
            />
          )
        }}
      />

      {info && <InfoText text={info} />}

      <ButtonBar>
        <SaveButton
          data-testid={`submit${type.charAt(0).toUpperCase()}${type.slice(
            1
          )}Button`}
          variant="secondary"
          type="submit"
        >
          Opslaan
        </SaveButton>

        <Button
          data-testid={`cancel${type.charAt(0).toUpperCase()}${type.slice(
            1
          )}Button`}
          variant="tertiary"
          type="button"
          onClick={handleCancel}
        >
          Annuleer
        </Button>
      </ButtonBar>
    </form>
  )
  const key = rawDataToKey(get(incident, valuePath || path))
  const icon = getListIconByKey(options, key)
  const displayValueIcon = icon ? (
    <IconWrapper data-testid="displayValueIcon">{icon}</IconWrapper>
  ) : null

  return (
    <Fragment>
      <dt data-testid={`meta-list-${type}-definition`}>
        <DisplayValue>{display}</DisplayValue>
        {!showForm && (
          <EditButton
            data-testid={`edit${type.charAt(0).toUpperCase()}${type.slice(
              1
            )}Button`}
            disabled={disabled}
            onClick={onShowForm}
          />
        )}
      </dt>

      {showForm ? (
        <dd data-testid={`meta-list-${type}-value`}>{editForm}</dd>
      ) : (
        <dd data-testid={`meta-list-${type}-value`} className={valueClass}>
          <DisplayValue data-testid="valuePath" hasHighPriority={Boolean(icon)}>
            {displayValueIcon}
            {getListValueByKey(options, key)}
          </DisplayValue>
        </dd>
      )}
    </Fragment>
  )
}

ChangeValue.defaultProps = {
  groups: undefined,
}

ChangeValue.propTypes = {
  /* The selector component. Possible values: (RadioInput, SelectInput) */
  disabled: PropTypes.bool,
  display: PropTypes.string.isRequired,
  /** Indicator that is used to determine which list item prop should be used to display info text between the form field and the buttons */
  infoKey: PropTypes.string,
  /** The options to choose from, either for a RadioGroup or SelectInput*/
  options: dataListType.isRequired,
  /** The option groups to be used for grouping the options for SelectInput*/
  groups: PropTypes.array,
  patch: PropTypes.object,
  path: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  valueClass: PropTypes.string,
  valuePath: PropTypes.string,
  /** Returns the value of the incident path. Can be overridden to implement specific logic */
  rawDataToKey: PropTypes.func,
  /** Format function for the selected option. By default returns the selected option but can be overridden to implement sepecific logic */
  keyToRawData: PropTypes.func,
}

export default ChangeValue
