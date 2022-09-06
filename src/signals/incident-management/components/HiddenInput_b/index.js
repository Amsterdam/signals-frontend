// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam

export const HiddenInput = ({ name, value }) => (
    <div className="hidden-input">
      <input id={`form${name}`} type="hidden" value={value} />
    </div>
  )

export default HiddenInput
