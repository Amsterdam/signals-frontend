// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import step6 from '../wizard-step-6-bedankt'

describe('Wizard step 6 Bedankt', () => {
  it('should include new incident link when not in app mode', () => {
    expect(step6.form.controls).toMatchObject({
      next_incident_action: expect.anything(),
    })
  })

  it('should include close button when in app mode', () => {
    jest.isolateModules(() => {
      jest.mock('shared/services/configuration/configuration', () => ({
        __esModule: true,
        default: {
          ...jest.requireActual('shared/services/configuration/configuration')
            .default,
          featureFlags: {
            appMode: true,
          },
        },
      }))
      const step6 = require('../wizard-step-6-bedankt').default

      expect(step6.form.controls).toMatchObject({
        app_close_window_action: expect.anything(),
      })
    })
  })
})
