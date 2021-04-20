// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { SET_CAN_VIEW, SET_IS_RESPONSIBLE } from '../constants'
import reducer, { initialState } from '../reducer'

const intermediateState = {
  can_view: {
    afval: [
      {
        fk: 11,
        id: 11,
        disabled: true,
      },
      {
        fk: 132,
        id: 132,
        disabled: false,
      },
      {
        fk: 133,
        id: 133,
        disabled: false,
      },
    ],
  },
  is_responsible: {
    afval: [
      {
        fk: 11,
        id: 11,
      },
      {
        fk: 10,
        id: 10,
      },
    ],
  },
}

const payloadAllCategories = {
  slug: 'afval',
  subCategories: [
    {
      fk: 10,
      id: 10,
    },
    {
      fk: 4,
      id: 4,
    },
    {
      fk: 132,
      id: 132,
    },
    {
      fk: 133,
      id: 133,
    },
    {
      fk: 8,
      id: 8,
    },
    {
      fk: 90,
      id: 90,
    },
    {
      fk: 11,
      id: 11,
    },
  ],
}

describe('signals/settings/departments/Detail/components/CategoryLists/reducer', () => {
  it('should return the state', () => {
    expect(reducer(initialState, {})).toEqual(initialState)
  })

  describe('SET_CAN_VIEW', () => {
    it('should handle setting individual subcategories', () => {
      const payload = {
        slug: 'afval',
        subCategories: [
          {
            fk: 11,
            id: 11,
            disabled: true,
          },
          {
            fk: 132,
            id: 132,
            disabled: false,
          },
          {
            fk: 133,
            id: 133,
            disabled: false,
          },
          {
            fk: 90,
            id: 90,
            disabled: false,
          },
        ],
      }

      const action = {
        type: SET_CAN_VIEW,
        payload,
      }

      const expected = {
        ...intermediateState,
        can_view: {
          ...intermediateState.can_view,
          [payload.slug]: [
            ...payload.subCategories,
            {
              fk: 10,
              id: 10,
              disabled: true,
            },
          ],
        },
      }

      expect(reducer(initialState, action)).toEqual({
        can_view: {
          [payload.slug]: payload.subCategories.map((category) => ({
            ...category,
            disabled: false,
          })),
        },
        is_responsible: {},
      })

      expect(reducer(intermediateState, action)).toEqual(expected)
    })

    it('should handle setting all subcategories', () => {
      // resulting state should contain all categories where the ones that are also listed in is_responsible
      // should have prop `disabled` set to 'true'
      const payload = payloadAllCategories
      const action = {
        type: SET_CAN_VIEW,
        payload,
      }

      const expected = {
        ...intermediateState,
        can_view: {
          [payload.slug]: payload.subCategories.map((category) => ({
            ...category,
            disabled: !!intermediateState.is_responsible[payload.slug].find(
              ({ fk }) => fk === category.fk
            ),
          })),
        },
      }

      expect(reducer(initialState, action)).toEqual({
        can_view: {
          [payload.slug]: payload.subCategories.map((category) => ({
            ...category,
            disabled: false,
          })),
        },
        is_responsible: {},
      })

      expect(reducer(intermediateState, action)).toEqual(expected)
    })

    it('should handle setting no subcategories', () => {
      const payload = {
        slug: 'afval',
        subCategories: [],
      }

      const action = {
        type: SET_CAN_VIEW,
        payload,
      }

      const expected = {
        ...intermediateState,
        can_view: {
          [payload.slug]: intermediateState.is_responsible[
            payload.slug
          ].map((category) => ({ ...category, disabled: true })),
        },
      }

      expect(reducer(intermediateState, action)).toEqual(expected)
    })
  })

  describe('SET_IS_RESPONSIBLE', () => {
    it('should handle setting individual subcategories', () => {
      const payload = {
        slug: 'afval',
        subCategories: [
          {
            fk: 11,
            id: 11,
          },
          {
            fk: 10,
            id: 10,
          },
          {
            fk: 132,
            id: 132,
          },
        ],
      }

      const action = {
        type: SET_IS_RESPONSIBLE,
        payload,
      }

      expect(reducer(initialState, action)).toEqual({
        can_view: {
          [payload.slug]: payload.subCategories.map((category) => ({
            ...category,
            disabled: true,
          })),
        },
        is_responsible: {
          [payload.slug]: payload.subCategories,
        },
      })

      const canViewCategories = payload.subCategories.map((category) => ({
        ...category,
        disabled: true,
      }))

      const expected = {
        is_responsible: {
          ...intermediateState.is_responsible,
          [payload.slug]: payload.subCategories,
        },
        can_view: {
          ...intermediateState.can_view,

          // all categories that were set in the payload + the diff
          [payload.slug]: [
            {
              fk: 133,
              id: 133,
              disabled: false,
            },
          ].concat(canViewCategories),
        },
      }

      expect(reducer(intermediateState, action)).toEqual(expected)
    })

    it('should handle setting no subcategories', () => {
      const payload = {
        slug: 'afval',
        subCategories: [],
      }

      const action = {
        type: SET_IS_RESPONSIBLE,
        payload,
      }

      const expected = {
        can_view: {
          ...intermediateState.can_view,
          [payload.slug]: [],
        },
        is_responsible: {
          ...intermediateState.is_responsible,
          [payload.slug]: [],
        },
      }

      expect(reducer(intermediateState, action)).toEqual(expected)
    })
  })
})
