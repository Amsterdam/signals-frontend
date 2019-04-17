const ZoomMessageControl = L.Control.extend({
  options: {
    zoomMin: 0
  },

  initialize: function(options) {
    L.setOptions(this, options);
  },

  onAdd: function(map) {
    const div = L.DomUtil.create('div');
    div.innerText = "Zoom in om de objecten te zien";
    L.DomUtil.setClass(div, 'zoom-message');

    this.setVisibility(div, map.getZoom());

    map.on('zoomend', this.onZoomEnd, this);

    return div;
  },

  onRemove: function(map) {
    map.off('zoomend', this.onZoomEnd, this);
  },

  //
  // Custom methods
  //
  onZoomEnd: function () {
    this.setVisibility(this._container, this._map.getZoom());
  },

  setVisibility: function (element, zoomLevel) {
    if (zoomLevel >= this.options.zoomMin) {
      L.DomUtil.addClass(element, 'hide');
    } else {
      L.DomUtil.removeClass(element, 'hide');
    }
  }
});

const constructor = function(opts) {
  return new ZoomMessageControl(opts);
};

export default constructor;

