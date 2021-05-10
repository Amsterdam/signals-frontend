// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
/**
 * Loading message component using Leaflet Control API.
 */
const LoadingControl = L.Control.extend({
  options: {},

  initialize(options) {
    L.setOptions(this, options)
    this.inFlight = []
  },

  onAdd(map) {
    this._addLayerListeners(map)

    const div = this.options.element
    this._checkVisiblity(div)
    return div
  },

  onRemove(map) {
    this._removeLayerListeners(map)
  },

  //
  // Custom methods
  //
  _onDataLoading(event) {
    const id = event.target._leaflet_id
    this.inFlight.push(id)
    this._checkVisiblity(this._container)
  },
  _onDataLoad(event) {
    const id = event.target._leaflet_id
    this.inFlight = this.inFlight.filter((item) => item !== id)
    this._checkVisiblity(this._container)
  },

  _checkVisiblity(element) {
    const isVisible = this.inFlight.length > 0
    if (isVisible) {
      L.DomUtil.removeClass(element, 'hide')
    } else {
      L.DomUtil.addClass(element, 'hide')
    }
  },

  _addLayerLoadListener(layer) {
    layer.on(
      {
        loading: this._onDataLoading,
        load: this._onDataLoad,
        error: this._onDataLoad,
      },
      this
    )
  },

  _removeLayerLoadListener(layer) {
    layer.off(
      {
        loading: this._onDataLoading,
        load: this._onDataLoad,
        error: this._onDataLoad,
      },
      this
    )
  },

  _addLayerListeners(map) {
    map.eachLayer((layer) => this._addLayerLoadListener(layer))
  },

  _removeLayerListeners(map) {
    map.eachLayer((layer) => this._removeLayerLoadListener(layer))
  },
})

export default LoadingControl
