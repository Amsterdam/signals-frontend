// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { getIsAuthenticated } from '../../../../shared/services/auth/auth'
import { renderSources } from '../wizard-step-1-beschrijf'

jest.mock('shared/services/auth/auth')

const sources = [
  {
    key: 1,
    value: 'Source 1',
    can_be_selected: true,
  },
  {
    key: 2,
    value: 'Source 2',
    can_be_selected: false,
  },
]
const expectedSources = [{ '': 'Vul bron in' }, { 'Source 1': 'Source 1' }]

let formFactory

describe('Wizard step 1 beschrijf, formFactory', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    // We require the code here, to reload for each test, since the formFactory
    // function is memoized.
    // eslint-disable-next-line global-require
    formFactory = require('../wizard-step-1-beschrijf').default.formFactory
  })

  it('should use empty array when no sources', () => {
    const actual = formFactory({}, null)

    expect(actual.controls.source.meta.values).toEqual([])
  })

  it('should return sources', () => {
    const actual = formFactory({}, sources)

    expect(actual.controls.source.meta.values).toEqual(expectedSources)
  })

  it('should always return the same as the first time', () => {
    const expected = formFactory({}, sources)
    const actual1 = formFactory({}, sources)
    const actual2 = formFactory({}, [])

    expect(actual1).toBe(expected)
    expect(actual2).toBe(expected)
  })
})

describe('Wizard step 1, beschrijf, renderSources', () => {
  it('should render a hidden input when the form is visited via the app or online', () => {
    getIsAuthenticated.mockImplementation(() => false)
    expect(renderSources().name).toBe('HiddenInput')
  })
  it('should render the select input component when logged in', () => {
    getIsAuthenticated.mockImplementation(() => true)
    expect(renderSources().name).toBe('SelectInput')
  })
})
