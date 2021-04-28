// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'

export const HiddenInput = (props) => {
  const { name } = props
  const render = ({ handler }) => (
    <div className="hidden-input">
      <input id={`form${name}`} type="hidden" {...handler()} />
    </div>
  )

  render.propTypes = {
    handler: PropTypes.func.isRequired,
  }
  return render
}

export default HiddenInput
