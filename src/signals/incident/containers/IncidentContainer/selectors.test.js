// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'
import { initialState } from './reducer'
import {
  selectIncidentContainerDomain,
  makeSelectIncidentContainer,
  makeSelectCategory,
  makeSelectMaxAssetWarning,
} from './selectors'

describe('signals/incident/containers/IncidentContainer/selectors', () => {
  describe('selectIncidentContainerDomain', () => {
    it('should return the initial state', () => {
      expect(selectIncidentContainerDomain()).toEqual(initialState)
    })

    it('should return incidentContainer', () => {
      const incidentContainer = { incident: { foo: 'bar' } }
      const state = { incidentContainer }

      expect(selectIncidentContainerDomain(state)).toEqual(incidentContainer)
    })
  })

  describe('makeSelectIncidentContainer', () => {
    it('should select the incidentContainer', () => {
      const state = {
        incidentContainer: {
          incident: {
            category: 'poep',
          },
        },
      }
      const mockedState = fromJS(state)

      expect(makeSelectIncidentContainer.resultFunc(mockedState)).toEqual(state)
    })
  })

  it('returns category and subcategory slugs', () => {
    const catSubcat = {
      category: 'afval',
      subcategory: 'huisafval',
    }
    const state = {
      incident: catSubcat,
    }
    const mockedState = fromJS(state)

    expect(makeSelectCategory.resultFunc(mockedState)).toEqual(catSubcat)
  })

  describe('makeSelectMaxAssetWarning', () => {
    it('returns the maxAssetWarning state', () => {
      const warning = {
        maxAssetWarning: false,
      }
      const state = {
        incident: warning,
      }
      const mockedState = fromJS(state)

      expect(makeSelectMaxAssetWarning.resultFunc(mockedState)).toEqual(warning)
    })
  })
})
