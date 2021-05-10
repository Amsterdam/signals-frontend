// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'

import Label from 'components/Label'

import './style.scss'

export const CopyFileInput = (props) => {
  const { name, display, values } = props
  const render = ({ handler }) => (
    <div className="copy-file-input">
      <div className="mode_input text rij_verplicht">
        <Label htmlFor={`form${name}`}>{display}</Label>

        {values.map((attachment) => (
          <div
            key={attachment.location}
            className="copy-file-input__attachment"
            style={{ backgroundImage: `url(${attachment.location})` }}
          />
        ))}

        <div className="copy-file-input__control invoer antwoord">
          <input
            name={name}
            data-testid={name}
            id={`form${name}`}
            type="checkbox"
            {...handler('checkbox')}
          />
          <label htmlFor={`form${name}`}>Foto&apos;s toevoegen</label>
        </div>
      </div>
    </div>
  )

  render.defaultProps = {
    touched: false,
    values: [],
  }

  render.propTypes = {
    handler: PropTypes.func.isRequired,
    touched: PropTypes.bool,
    values: PropTypes.array,
  }
  return render
}

export default CopyFileInput
