// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { AlertLevel } from '@amsterdam/asc-ui'
import statusList, {
  isStatusClosed,
} from 'signals/incident-management/definitions/statusList'
import { Status } from 'signals/incident-management/definitions/types'

import type { StatusCode } from 'signals/incident-management/definitions/types'
import type { Incident } from 'types/api/incident'

import { IncidentChild } from '../../types'
import { StatusFormActions } from './actions'
import {
  determineWarnings,
  emailSentWhenStatusChangedTo,
  getTextConfig,
  textIsRequired,
} from './utils'

export type State = {
  originalStatus: Status
  status: Status
  check: {
    checked: boolean
    disabled: boolean
  }
  errors: {
    text?: string
  }
  text: {
    defaultValue: string
    value: string
    required: boolean
    label: string
    subtitle: string
    maxLength: number
    rows: number
  }
  flags: {
    isSplitIncident: boolean
    hasEmail: boolean
    hasOpenChildren: boolean
  }
  warnings: {
    key: string
    heading?: string
    content: string
    level: AlertLevel
  }[]
}

export const init = ({
  incident,
  childIncidents,
}: {
  incident: Incident
  childIncidents: IncidentChild[]
}): State => {
  const incidentStatus = statusList.find(
    ({ key }) => key === incident.status?.state
  ) as Status
  const isSplitIncident = incident._links?.['sia:parent'] !== undefined

  const initialEmailSentState = emailSentWhenStatusChangedTo({
    fromStatus: incidentStatus.key,
    toStatus: incidentStatus.key,
    isSplitIncident,
  })

  const hasEmail = Boolean(incident.reporter?.email)

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
      required: textIsRequired({
        fromStatus: incidentStatus.key,
        toStatus: incidentStatus.key,
        isSplitIncident,
      }),
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
      originalStatus: incidentStatus.key,
      toStatus: incidentStatus.key,
    }),
  }
}

const reducer = (state: State, action: StatusFormActions): State => {
  switch (action.type) {
    case 'SET_STATUS': {
      const checkboxIsChecked = emailSentWhenStatusChangedTo({
        toStatus: action.payload.key,
        fromStatus: state.originalStatus.key,
        isSplitIncident: state.flags.isSplitIncident,
      })

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
          required: textIsRequired({
            toStatus: action.payload.key as StatusCode,
            fromStatus: state.originalStatus.key as StatusCode,
            isSplitIncident: state.flags.isSplitIncident,
          }),
        },
        warnings: determineWarnings({
          isSplitIncident: state.flags.isSplitIncident,
          hasEmail: state.flags.hasEmail,
          hasOpenChildren: state.flags.hasOpenChildren,
          toStatus: action.payload.key as StatusCode,
          originalStatus: state.originalStatus.key as StatusCode,
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
