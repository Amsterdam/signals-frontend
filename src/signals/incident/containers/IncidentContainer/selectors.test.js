// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'
import { initialState } from './reducer'
import {
  selectIncidentContainerDomain,
  makeSelectIncidentContainer,
  makeSelectCoordinates,
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

  describe('makeSelectCoordinates', () => {
    const state = {
      incident: {
        category: 'poep',
        location: undefined,
      },
    }

    it('returns nothing', () => {
      const mockedState = fromJS(state)

      expect(makeSelectCoordinates.resultFunc(mockedState)).toBeUndefined()
    })

    it('returns coordinates', () => {
      const coordinates = [4.899295459015508, 52.37211092764973]
      const location = {
        coordinates,
      }
      const stateWithLocation = { ...state }
      stateWithLocation.incident.location = location

      const mockedState = fromJS(stateWithLocation)

      expect(makeSelectCoordinates.resultFunc(mockedState)).toStrictEqual(
        coordinates
      )
    })
  })
})
