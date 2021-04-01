// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
const ZoomMessageControl = L.Control.extend({
  options: {
    zoomMin: 0,
  },

  initialize(options) {
    L.setOptions(this, options);
  },

  onAdd(map) {
    const div = L.DomUtil.create('div', 'zoom-control');
    div.innerText = 'Zoom in om de objecten te zien';

    this.setVisibility(div, map.getZoom());

    map.on('zoomend', this.onZoomEnd, this);

    return div;
  },

  onRemove(map) {
    map.off('zoomend', this.onZoomEnd, this);
  },

  //
  // Custom methods
  //
  onZoomEnd() {
    this.setVisibility(this._container, this._map.getZoom());
  },

  setVisibility(element, zoomLevel) {
    if (zoomLevel >= this.options.zoomMin) {
      L.DomUtil.addClass(element, 'hide');
    } else {
      L.DomUtil.removeClass(element, 'hide');
    }
  },
});

export default ZoomMessageControl;
