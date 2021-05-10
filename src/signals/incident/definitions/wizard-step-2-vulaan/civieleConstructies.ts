// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { FIELD_TYPE_MAP } from 'signals/incident/containers/IncidentContainer/constants'

export const civieleConstructies = {
  extra_brug: {
    meta: {
      ifAllOf: {
        subcategory: 'bruggen',
      },
      label: 'Wat is de naam of het nummer van de brug?',
      shortLabel: 'Naam brug',
      pathMerge: 'extra_properties',
    },
    render: FIELD_TYPE_MAP.text_input,
  },
}

export default civieleConstructies
