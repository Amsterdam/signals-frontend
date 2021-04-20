// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
const ErrorControl = L.Control.extend({
  options: {
    message: 'Oops, something went wrong',
  },

  initialize(options) {
    L.setOptions(this, options)
  },

  onAdd() {
    const div = L.DomUtil.create('div', 'error-control')
    div.innerText = this.options.message
    L.DomUtil.addClass(div, 'hide')
    return div
  },

  show() {
    L.DomUtil.removeClass(this._container, 'hide')
  },

  hide() {
    L.DomUtil.addClass(this._container, 'hide')
  },
})

export default ErrorControl
