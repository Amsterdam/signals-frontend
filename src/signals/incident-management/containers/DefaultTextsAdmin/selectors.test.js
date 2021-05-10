// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'
import makeSelectDefaultTextsAdmin from './selectors'

describe('makeSelectDefaultTextsAdmin', () => {
  it('should select the incidentOverviewPage', () => {
    const selector = makeSelectDefaultTextsAdmin()
    const defaultTextsAdmin = {
      defaultTexts: [],
    }

    const mockedState = {
      defaultTextsAdmin: fromJS(defaultTextsAdmin),
    }

    expect(selector(mockedState)).toEqual(defaultTextsAdmin)
  })
})
