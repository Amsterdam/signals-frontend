// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import statusList, {
  changeStatusOptionList,
  StatusCode,
} from 'signals/incident-management/definitions/statusList'
import * as constants from './constants'

const emailSentWhenStatusChangedTo = (
  toStatus,
  fromStatus,
  isSplitIncident
) => {
  if (isSplitIncident) return false

  if (
    fromStatus === StatusCode.VerzoekTotHeropenen &&
    toStatus === StatusCode.Afgehandeld
  ) {
    return false
  }

  return Boolean(
    changeStatusOptionList.find(
      ({ email_sent_when_set, key }) => email_sent_when_set && toStatus === key
    )
  )
}

const determineWarning = (selectedStatusKey, isSplitIncident) => {
  if (isSplitIncident) return ''
  if (selectedStatusKey === 'o') return constants.AFGEHANDELD_EXPLANATION
  return ''
}

const textIsRequired = (toStatus, fromStatus, isSplitIncident) => {
  if (isSplitIncident) {
    if (
      [
        StatusCode.Afgehandeld,
        StatusCode.Ingepland,
        StatusCode.Heropend,
      ].includes(toStatus)
    ) {
      return true
    }
  } else
    return emailSentWhenStatusChangedTo(toStatus, fromStatus, isSplitIncident)
}

export const init = (incident) => {
  const incidentStatus = statusList.find(
    ({ key }) => key === incident.status.state
  )
  const isSplitIncident = incident?._links?.['sia:parent'] !== undefined

  const initialEmailSentState = emailSentWhenStatusChangedTo(
    incidentStatus.key,
    incidentStatus.key,
    isSplitIncident
  )

  const textRequiredValue = textIsRequired(
    incidentStatus.key,
    incidentStatus.key,
    isSplitIncident
  )

  return {
    originalStatus: incidentStatus,
    status: incidentStatus,
    check: {
      checked: initialEmailSentState,
      disabled: initialEmailSentState,
    },
    errors: {},
    text: {
      defaultValue: '',
      value: '',
      required: textRequiredValue,
    },
    isSplitIncident,
    warning: determineWarning(incidentStatus.key, isSplitIncident),
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_STATUS': {
      const checkboxIsChecked = emailSentWhenStatusChangedTo(
        action.payload.key,
        state.originalStatus.key,
        state.isSplitIncident
      )

      const textRequiredValue = textIsRequired(
        action.payload.key,
        state.originalStatus.key,
        state.isSplitIncident
      )

      return {
        ...state,
        check: {
          checked: checkboxIsChecked,
          disabled: checkboxIsChecked,
        },
        errors: { ...state.errors, text: undefined },
        status: action.payload,
        text: { ...state.text, defaultValue: '', required: textRequiredValue },
        warning: determineWarning(action.payload.key, state.isSplitIncident),
      }
    }

    case 'TOGGLE_CHECK':
      return {
        ...state,
        check: { ...state.check, checked: !state.check.checked },
        text: { ...state.text, required: !state.check.checked },
      }

    case 'SET_WARNING':
      return { ...state, warning: action.payload }

    case 'SET_DEFAULT_TEXT':
      return {
        ...state,
        errors: { ...state.errors, text: undefined },
        text: { ...state.text, value: '', defaultValue: action.payload },
      }

    case 'SET_TEXT':
      return {
        ...state,
        errors: { ...state.errors, text: undefined },
        text: { ...state.text, value: action.payload, defaultValue: '' },
      }

    case 'SET_ERRORS':
      return { ...state, errors: { ...state.errors, ...action.payload } }

    default:
      return state
  }
}

export default reducer
