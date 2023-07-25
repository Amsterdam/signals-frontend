// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
// eslint-disable-next-line no-restricted-imports
import React from 'react'

import { ThemeProvider } from '@amsterdam/asc-ui'
import { createMemoryHistory } from 'history'
import isObject from 'lodash/isObject'
import MatchMediaMock from 'match-media-mock'
import { FormProvider, useForm } from 'react-hook-form'
import { Provider } from 'react-redux'
import { HistoryRouter as Router } from 'redux-first-history/rr6'

import MapContext from 'containers/MapContext'
import loadModels from 'models'
import usersJSON from 'utils/__tests__/fixtures/users.json'

import { ConfirmationProvider } from '../components/Confirmation'
import configureStore from '../configureStore'
import constructYupResolver from '../signals/incident/services/yup-resolver'

// set a default screenwidth of 2560 pixels
const mmm = MatchMediaMock.create()

mmm.setConfig({ type: 'screen', width: 2560 })

// eslint-disable-next-line no-undef
Object.defineProperty(global.window, 'matchMedia', {
  value: mmm,
  writable: true,
})

export const testActionCreator = (action, actionType, payload) => {
  const expected = {
    type: actionType,
    payload,
  }
  expect(action(payload)).toEqual(expected)
}

export const history = createMemoryHistory()

export const { store } = configureStore({})

loadModels(store)

export const withAppContext = (Component) => (
  <ThemeProvider>
    <Provider store={store}>
      <ConfirmationProvider>
        <Router history={history}>{Component}</Router>
      </ConfirmationProvider>
    </Provider>
  </ThemeProvider>
)

export const FormProviderWithResolver = ({
  fieldConfig,
  children,
  reactHookFormProps,
}) => {
  const controls = Object.fromEntries(
    Object.entries(fieldConfig.controls).filter(
      ([key, value]) => value.meta?.isVisible || key === '$field_0'
    )
  )

  const formProps = useForm({
    reValidateMode: 'onSubmit',
    resolver: constructYupResolver(controls),
  })

  return (
    <FormProvider {...formProps}>
      {React.cloneElement(children, {
        reactHookFormProps: { ...formProps, ...reactHookFormProps },
      })}
    </FormProvider>
  )
}

/**
 * Get a list of users from JSON data that is coming from the API endpoint
 * Invalid keys are filtered out of the return value.
 *
 * @param {Object} users
 */
export const userObjects = (users = usersJSON) =>
  users.results.map((item) =>
    Object.keys(item)
      .filter((key) => !key.startsWith('_'))
      .filter((key) => !isObject(item[key]))
      .reduce((rawObj, key) => {
        const obj = { ...rawObj }

        obj[key] = item[key]

        return obj
      }, {})
  )

export const withMapContext = (Component) =>
  withAppContext(<MapContext>{Component}</MapContext>)
