// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import statusList, {
  changeStatusOptionList,
  isStatusClosed,
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

const determineWarnings = ({
  originalStatus,
  toStatus,
  isSplitIncident,
  hasEmail,
  hasOpenChildren,
}) => {
  const warnings = []

  if (isSplitIncident)
    if (toStatus === StatusCode.ReactieGevraagd) {
      return [
        {
          key: 'split-incident-reply-warning',
          level: 'info',
          content: constants.REPLY_DEELMELDING_EXPLANATION,
        },
      ]
    } else {
      return [
        {
          key: 'split-incident-warning',
          level: 'info',
          content: constants.DEELMELDING_EXPLANATION,
        },
      ]
    }

  if (isStatusClosed(toStatus) && hasOpenChildren) {
    warnings.push({
      key: 'has-open-child-incidents-warning',
      heading: constants.DEELMELDINGEN_STILL_OPEN_HEADING,
      content: constants.DEELMELDINGEN_STILL_OPEN_CONTENT,
      level: 'info',
    })
  }

  if (originalStatus === StatusCode.ReactieGevraagd && hasEmail) {
    warnings.push({
      key: 'has-open-reply-request-warning',
      heading: constants.REPLY_CHANGE_STATUS_HEADING,
      content: constants.REPLY_CHANGE_STATUS_CONTENT,
      level: 'info',
    })
  }

  if (toStatus === StatusCode.Afgehandeld)
    warnings.push({
      key: 'end-status-warning',
      content: constants.AFGEHANDELD_CONTENT,
      level: 'neutral',
    })

  if (toStatus === StatusCode.ReactieGevraagd && !hasEmail) {
    warnings.push({
      key: 'has-no-email-reply-warning',
      heading: constants.REPLY_NO_MAIL_HEADING,
      content: constants.REPLY_NO_MAIL_CONTENT,
      level: 'error',
    })
  }

  if (
    originalStatus === StatusCode.Verzonden &&
    toStatus === StatusCode.ReactieGevraagd
  ) {
    warnings.push({
      key: 'external-reply-warning',
      content: constants.REPLY_EXTERNAL_CONTENT,
      level: 'error',
    })
  }

  return warnings
}

const getTextConfig = (statusCode) => {
  return statusCode === StatusCode.ReactieGevraagd
    ? {
        label: constants.REPLY_MAIL_LABEL,
        subtitle: constants.REPLY_MAIL_SUBTITLE,
        maxLength: constants.REPLY_MAIL_MAX_LENGTH,
        rows: 5,
      }
    : {
        label: constants.DEFAULT_TEXT_LABEL,
        subtitle: constants.DEFAULT_TEXT_SUBTITLE,
        maxLength: constants.DEFAULT_TEXT_MAX_LENGTH,
        rows: 9,
      }
}

export const init = ({ incident, childIncidents }) => {
  const incidentStatus = statusList.find(
    ({ key }) => key === incident.status.state
  )
  const isSplitIncident = incident._links?.['sia:parent'] !== undefined

  const initialEmailSentState = emailSentWhenStatusChangedTo(
    incidentStatus.key,
    incidentStatus.key,
    isSplitIncident
  )

  const hasEmail = Boolean(incident.reporter.email)

  const hasOpenChildren = Boolean(
    childIncidents
      ?.map((child) => !isStatusClosed(child.status.state))
      .some((v) => v === true)
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
      ...getTextConfig(incidentStatus.key),
      defaultValue: '',
      value: '',
      required: initialEmailSentState,
    },
    flags: {
      isSplitIncident,
      hasEmail,
      hasOpenChildren,
    },
    warnings: determineWarnings({
      hasEmail,
      isSplitIncident,
      hasOpenChildren,
      fromStatus: incidentStatus.key,
      toStatus: incidentStatus.key,
    }),
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_STATUS': {
      const checkboxIsChecked = emailSentWhenStatusChangedTo(
        action.payload.key,
        state.originalStatus.key,
        state.flags.isSplitIncident
      )

      return {
        ...state,
        check: {
          checked: checkboxIsChecked,
          disabled: checkboxIsChecked,
        },
        errors: { ...state.errors, text: undefined },
        status: action.payload,
        text: {
          ...state.text,
          ...getTextConfig(action.payload.key),
          defaultValue: '',
          required: checkboxIsChecked,
        },
        warnings: determineWarnings({
          isSplitIncident: state.flags.isSplitIncident,
          hasEmail: state.flags.hasEmail,
          hasOpenChildren: state.flags.hasOpenChildren,
          toStatus: action.payload.key,
          originalStatus: state.originalStatus.key,
        }),
      }
    }

    case 'TOGGLE_CHECK':
      return {
        ...state,
        check: { ...state.check, checked: !state.check.checked },
        text: { ...state.text, required: !state.check.checked },
      }

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
