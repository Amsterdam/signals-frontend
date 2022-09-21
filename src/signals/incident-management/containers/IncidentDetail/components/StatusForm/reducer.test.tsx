// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import statusList, {
  changeStatusOptionList,
  GEMELD,
} from 'signals/incident-management/definitions/statusList'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import type { Status } from 'signals/incident-management/definitions/types'
import { StatusCode } from 'signals/incident-management/definitions/types'
import * as constants from './constants'

import reducer, { init } from './reducer'

const someStatus = {
  key: StatusCode.Gemeld,
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
  value: 'foo',
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const initialisedState = init({ incident: incidentFixture })
const state = {
  originalStatus: GEMELD,
  status: someStatus,
  check: {
    checked: false,
    disabled: false,
  },
  emailTemplate: {},
  errors: { text: undefined },
  text: {
    defaultValue: '',
    value: 'bar',
    required: false,
    label: 'Bericht aan melder',
    maxLength: 3000,
    rows: 9,
  },
  flags: {
    isSplitIncident: false,
    hasEmail: true,
    hasOpenChildren: false,
  },
  warnings: [],
}

describe('signals/incident-management/containers/IncidentDetail/components/StatusForm/reducer', () => {
  it('should initialise the state', () => {
    const status = statusList.find(
      ({ key }) => key === incidentFixture.status.state
    )

    expect(initialisedState).toEqual({
      status,
      check: {
        checked: false,
        disabled: false,
      },
      emailTemplate: {
        subject: undefined,
        html: undefined,
      },
      errors: {},
      flags: {
        hasEmail: true,
        hasOpenChildren: false,
        isSplitIncident: false,
      },
      text: {
        defaultValue: '',
        value: '',
        required: false,
        label: constants.DEFAULT_TEXT_LABEL,
        maxLength: constants.DEFAULT_TEXT_MAX_LENGTH,
        rows: 9,
      },
      warnings: [],
      originalStatus: status,
    })
  })

  it('should return the state', () => {
    expect(reducer(state, { type: 'SET_STATUS', payload: someStatus })).toEqual(
      state
    )
  })

  it('should handle SET_STATUS', () => {
    const intermediateState = {
      ...initialisedState,
      check: {
        checked: false,
        disabled: false,
      },
      errors: { someOther: 'This be required', text: 'Whoops' },
      text: {
        ...initialisedState.text,
        defaultValue: 'Some default value',
        value: 'A previously set value',
      },
    }

    const statusSendsEmailWhenSet = changeStatusOptionList.find(
      ({ email_sent_when_set }) => email_sent_when_set
    )
    const expectedState = {
      ...intermediateState,
      check: {
        checked: true,
        disabled: true,
      },
      errors: { ...intermediateState.errors, text: undefined },
      status: statusSendsEmailWhenSet,
      text: {
        ...intermediateState.text,
        defaultValue: '',
        required: true,
        label: constants.REPLY_MAIL_LABEL,
        maxLength: constants.REPLY_MAIL_MAX_LENGTH,
        rows: 6,
      },
    }

    expect(
      reducer(intermediateState, {
        type: 'SET_STATUS',
        payload: statusSendsEmailWhenSet as Status,
      })
    ).toEqual(expect.objectContaining(expectedState))
  })

  it('should handle TOGGLE_CHECK', () => {
    const afterToggle = reducer(initialisedState, {
      type: 'TOGGLE_CHECK',
      payload: undefined,
    })

    expect(afterToggle).toEqual({
      ...initialisedState,
      check: { ...initialisedState.check, checked: true },
      text: { ...initialisedState.text, required: true },
    })

    expect(
      reducer(afterToggle, { type: 'TOGGLE_CHECK', payload: undefined })
    ).toEqual(initialisedState)
  })

  it('should handle SET_DEFAULT_TEXT', () => {
    const intermediateState = {
      ...initialisedState,
      errors: { someOther: 'This be required', text: 'Whoops' },
      text: { ...initialisedState.text, value: 'A previously set value' },
    }

    const payload = 'Here be dragons'
    expect(
      reducer(intermediateState, { type: 'SET_DEFAULT_TEXT', payload })
    ).toEqual({
      ...intermediateState,
      errors: { ...intermediateState.errors, text: undefined },
      text: { ...intermediateState.text, value: '', defaultValue: payload },
    })
  })

  it('should handle SET_TEXT', () => {
    const intermediateState = {
      ...initialisedState,
      errors: { someOther: 'This be required', text: 'Whoops' },
      text: {
        ...initialisedState.text,
        defaultValue: 'A previously set value',
      },
    }

    const payload = 'Here be dragons'
    expect(reducer(intermediateState, { type: 'SET_TEXT', payload })).toEqual({
      ...intermediateState,
      errors: { ...intermediateState.errors, text: undefined },
      text: { ...intermediateState.text, value: payload, defaultValue: '' },
    })
  })

  it('should handle SET_ERRORS', () => {
    const intermediateState = {
      ...initialisedState,
      errors: { someOther: 'This be required', text: 'Whoops' },
    }

    const payload = { text: 'Here be dragons' }
    expect(reducer(intermediateState, { type: 'SET_ERRORS', payload })).toEqual(
      {
        ...intermediateState,
        errors: { ...intermediateState.errors, ...payload },
      }
    )
  })

  it('should handle SET_EMAIL_TEMPLATE', () => {
    const payload = { subject: 'subject', html: 'html' }
    expect(
      reducer(initialisedState, { type: 'SET_EMAIL_TEMPLATE', payload })
    ).toEqual({
      ...initialisedState,
      emailTemplate: payload,
    })
  })
})
