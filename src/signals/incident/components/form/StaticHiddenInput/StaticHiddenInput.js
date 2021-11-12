// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'

import { useEffect } from 'react'

export const StaticHiddenInput = (props) => {
  const { parent, meta } = props

  const Render = ({ handler }) => {
    useEffect(() => {
      parent.meta.updateIncident({
        [meta.name]: meta.value,
      })
    }, [])
    return (
      <input
        data-testid="hidden-input"
        type="hidden"
        id={meta.name}
        value={meta.value}
        {...handler}
      />
    )
  }

  Render.propTypes = {
    handler: PropTypes.func,
  }
  return <Render />
}

export default StaticHiddenInput
