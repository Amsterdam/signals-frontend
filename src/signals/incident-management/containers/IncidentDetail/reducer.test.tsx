// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import type { DefaultTexts } from 'types/api/default-text'
import type { Incident } from 'types/api/incident'
import { StatusCode } from 'types/status-code'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'

import {
  CLOSE_ALL,
  EDIT,
  EXTERNAL,
  PATCH_START,
  PATCH_SUCCESS,
  PREVIEW,
  RESET,
  SET_ATTACHMENTS,
  SET_CHILDREN,
  SET_CHILDREN_HISTORY,
  SET_CHILD_INCIDENTS,
  SET_DEFAULT_TEXTS,
  SET_ERROR,
  SET_HISTORY,
  SET_INCIDENT,
} from './constants'
import reducer, { initialState, closedState } from './reducer'
import type { Attachment, HistoryEntry, IncidentChild, Result } from './types'

describe('signals/incident-management/containers/IncidentDetail/reducer', () => {
  const state = {
    ...initialState,
    defaultTexts: [],
    foo: 'bar',
  }

  const someStatus = {
    key: StatusCode.Gemeld,
    email_sent_when_set: false,
    shows_remaining_sla_days: true,
    value: 'foo',
  }

  it('should return the state', () => {
    expect(
      reducer(state, { type: SET_INCIDENT, payload: state.incident })
    ).toEqual(state)
  })

  it('should handle RESET', () => {
    expect(reducer(state, { type: RESET })).toEqual(initialState)
  })

  it('should handle CLOSE_ALL', () => {
    expect(reducer(state, { type: CLOSE_ALL })).toEqual({
      ...state,
      ...closedState,
    })
  })

  it('should handle SET_ERROR', () => {
    const error = new Error('Whoopsie!')
    expect(reducer(state, { type: SET_ERROR, payload: error })).toEqual({
      ...state,
      error,
    })
  })

  it('should handle SET_ATTACHMENTS', () => {
    const attachments = {
      count: 2,
      results: [
        { location: '', is_image: true },
        { location: '', is_image: false },
      ],
    } as Result<Attachment>
    expect(
      reducer(state, { type: SET_ATTACHMENTS, payload: attachments })
    ).toEqual({ ...state, attachments })
  })

  it('should handle SET_CHILDREN', () => {
    const children = {
      count: 2,
      results: [
        {
          _links: 'bar',
          id: 1,
          status: someStatus,
          category: {},
          can_view_signal: true,
          updated_at: '',
        },
        {
          _links: 'bar',
          id: 2,
          status: someStatus,
          category: {},
          can_view_signal: true,
          updated_at: '',
        },
      ],
    } as unknown as Result<IncidentChild>

    expect(reducer(state, { type: SET_CHILDREN, payload: children })).toEqual({
      ...state,
      children,
    })
  })

  it('should handle SET_CHILDREN_HISTORY', () => {
    const childrenHistory = [
      [
        {
          identifier: 'bar',
          when: '',
          what: '',
          action: '',
          description: '',
          who: '',
        },
        {
          identifier: 'baz',
          when: '',
          what: '',
          action: '',
          description: '',
          who: '',
        },
      ],
    ] as HistoryEntry[][]
    expect(
      reducer(state, { type: SET_CHILDREN_HISTORY, payload: childrenHistory })
    ).toEqual({ ...state, childrenHistory })
  })

  it('should handle SET_CHILD_INCIDENTS', () => {
    const childIncidents = [incidentFixture]
    expect(
      reducer(state, {
        type: SET_CHILD_INCIDENTS,
        payload: [incidentFixture as unknown as Incident],
      })
    ).toEqual({ ...state, childIncidents })
  })

  it('should handle SET_DEFAULT_TEXTS', () => {
    const defaultTexts = ['foo', 'bar', 'baz'] as unknown as DefaultTexts
    expect(
      reducer(state, { type: SET_DEFAULT_TEXTS, payload: defaultTexts })
    ).toEqual({ ...state, defaultTexts })
  })

  it('should handle SET_HISTORY', () => {
    const history = [
      {
        identifier: 'one',
        when: '',
        what: '',
        action: '',
        description: '',
        who: '',
      },
    ]
    expect(reducer(state, { type: SET_HISTORY, payload: history })).toEqual({
      ...state,
      history,
    })
  })

  it('should handle SET_INCIDENT', () => {
    const children = [{ foo: 'bar' }, { bar: 'baz' }]
    const incident = {
      text: 'incident text',
      created_at: new Date(0).toISOString(),
      location: {
        address_text: '124 Conch St., Bikini Bottom',
      },
      status: {
        state_display: 'Gemeld',
      },
      category: {
        sub: 'Spongebob',
        departments: 'Patrick',
        sub_slug: 'overig-afval',
        main: 'foo',
        main_slug: 'foo',
        category_url: 'foo',
        created_by: 'foo',
        text: null,
        deadline: 'foo',
        deadline_factor_3: 'foo',
      },
    }

    const intermediateState = {
      ...state,
      incident,
      children,
    }

    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reducer(intermediateState, { type: SET_INCIDENT, payload: incident })
    ).toEqual({
      ...intermediateState,
      incident,
      children,
    })
  })

  it('should handle PATCH_START', () => {
    const patching = 'status'
    expect(reducer(state, { type: PATCH_START, payload: patching })).toEqual({
      ...state,
      patching,
    })
  })

  it('should handle PATCH_SUCCESS', () => {
    const intermediateState = {
      ...state,
      patching: 'zork',
    }
    expect(reducer(intermediateState, { type: PATCH_SUCCESS })).toEqual({
      ...intermediateState,
      patching: undefined,
    })
  })

  it('should handle PREVIEW', () => {
    const payload = {
      preview: 'attachment',
      attachmentHref: 'foo',
    }
    expect(reducer(state, { type: PREVIEW, payload })).toEqual({
      ...state,
      edit: undefined,
      external: false,
      ...payload,
    })
  })

  it('should handle EXTERNAL', () => {
    const mockState = {
      ...state,
      edit: 'foo',
      preview: 'bar',
    }
    expect(reducer(mockState, { type: EXTERNAL })).toEqual({
      ...mockState,
      edit: undefined,
      external: !mockState.external,
      preview: undefined,
    })
  })

  it('should handle EDIT', () => {
    const payload = {
      edit: 'location',
      foo: 'bar',
    }
    expect(reducer(state, { type: EDIT, payload })).toEqual({
      ...state,
      preview: undefined,
      ...payload,
    })
  })
})
