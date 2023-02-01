// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { mainCategories, subCategories } from 'utils/__tests__/fixtures'
import categories from 'utils/__tests__/fixtures/categories.json'

import {
  RESET,
  SAVE_SUBMIT_BUTTON_LABEL,
  SET_ADDRESS,
  SET_CATEGORIES,
  SET_DATE,
  SET_GROUP_OPTIONS,
  SET_MAIN_CATEGORY,
  SET_NAME,
  SET_NOTE_KEYWORD,
  SET_REFRESH,
  SET_SAVE_BUTTON_LABEL,
} from '../constants'
import reducer, { initialState } from '../reducer'

describe('signals/incident-management/components/FilterForm/reducer', () => {
  const state = {
    ...initialState,
    foo: 'bar',
  }

  it('should handle RESET', () => {
    expect(reducer(state, { type: RESET })).toEqual(initialState)
  })

  it('should handle SET_ADDRESS', () => {
    const address_text = 'Weesperstraat 113'
    const stateWithAddress = {
      ...state,
      options: {
        ...state.options,
        address_text,
      },
    }

    expect(
      reducer(state, { type: SET_ADDRESS, payload: address_text })
    ).toEqual(stateWithAddress)
  })

  it('should handle SET_NOTE_KEYWORD', () => {
    const note_keyword = 'testnote'
    const stateWithNoteKeyword = {
      ...state,
      options: {
        ...state.options,
        note_keyword,
      },
    }

    expect(
      reducer(state, { type: SET_NOTE_KEYWORD, payload: note_keyword })
    ).toEqual(stateWithNoteKeyword)
  })

  it('should handle SET_NAME', () => {
    const name = 'Everything urgent in the past week'
    const stateWithName = {
      ...state,
      filter: {
        ...state.filter,
        name,
      },
    }

    expect(reducer(state, { type: SET_NAME, payload: name })).toEqual(
      stateWithName
    )
  })

  it('should handle SET_REFRESH', () => {
    const refresh = true
    const stateWithRefresh = {
      ...state,
      filter: {
        ...state.filter,
        refresh,
      },
    }

    expect(reducer(state, { type: SET_REFRESH, payload: refresh })).toEqual(
      stateWithRefresh
    )
  })

  it('should handle SET_DATE', () => {
    const date = { created_before: '2020-01-30' }
    const stateWithDate = {
      ...state,
      options: {
        ...state.options,
        ...date,
      },
    }

    expect(reducer(state, { type: SET_DATE, payload: date })).toEqual(
      stateWithDate
    )
  })

  it('should handle SET_GROUP_OPTIONS', () => {
    const options = categories.mainToSub.afval
    const stateWithGroupOptions = {
      ...state,
      options: {
        ...state.options,
        ...options,
      },
    }

    expect(
      reducer(state, { type: SET_GROUP_OPTIONS, payload: options })
    ).toEqual(stateWithGroupOptions)
  })

  it('should handle SET_SAVE_BUTTON_LABEL', () => {
    const stateWithSaveButtonLabel = {
      ...state,
      submitBtnLabel:
        SAVE_SUBMIT_BUTTON_LABEL as typeof SAVE_SUBMIT_BUTTON_LABEL,
    }

    expect(
      reducer(state, {
        type: SET_SAVE_BUTTON_LABEL,
        payload: true,
      })
    ).toEqual(stateWithSaveButtonLabel)

    expect(
      reducer(stateWithSaveButtonLabel, {
        type: SET_SAVE_BUTTON_LABEL,
        payload: false,
      })
    ).toEqual(state)
  })

  describe('handle categories', () => {
    const mainCatSlug = 'afval'
    const mainCategory = mainCategories?.find(
      ({ slug }) => slug === mainCatSlug
    )
    const subs =
      subCategories?.filter(
        ({ parentKey }) => parentKey === mainCategory?.key
      ) || []
    const stateWithSubcategories = {
      ...state,
      options: {
        ...state.options,
        category_slug: subs,
      },
    }

    const stateWithMainCategory = {
      ...state,
      options: {
        ...state.options,
        maincategory_slug: [mainCategory],
      },
    }

    const stateWithAllCategories = {
      ...state,
      options: {
        ...state.options,
        maincategory_slug: [mainCategory],
        category_slug: subs?.slice(0, 3),
      },
    }

    it('should handle SET_MAIN_CATEGORY', () => {
      // setting a main category should remove all correspoding subcategories from the state
      expect(
        reducer(stateWithSubcategories, {
          type: SET_MAIN_CATEGORY,
          payload: {
            // eslint-disable-next-line
            // @ts-ignore
            category: mainCategory,
            isToggled: true,
          },
        })
      ).toEqual(stateWithMainCategory)

      expect(
        reducer(stateWithSubcategories, {
          type: SET_MAIN_CATEGORY,
          payload: {
            // eslint-disable-next-line
            // @ts-ignore
            category: mainCategory,
            isToggled: false,
          },
        })
      ).toEqual(state)

      expect(
        // eslint-disable-next-line
        // @ts-ignore
        reducer(stateWithAllCategories, {
          type: SET_MAIN_CATEGORY,
          payload: {
            category: mainCategory,
            isToggled: false,
          },
        })
      ).toEqual(state)
    })

    it('should handle SET_CATEGORIES', () => {
      // setting a category means that a single category has been selected and that the
      // main category entry should be removed from the state
      expect(
        // eslint-disable-next-line
        // @ts-ignore
        reducer(stateWithMainCategory, {
          type: SET_CATEGORIES,
          payload: {
            slug: mainCatSlug,
            subCategories: subs,
          },
        })
      ).toEqual(stateWithSubcategories)

      expect(
        // eslint-disable-next-line
        // @ts-ignore
        reducer(stateWithAllCategories, {
          type: SET_CATEGORIES,
          payload: {
            slug: mainCatSlug,
            subCategories: subs,
          },
        })
      ).toEqual(stateWithSubcategories)
    })
  })
})
