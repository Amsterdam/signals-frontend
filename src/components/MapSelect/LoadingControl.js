/**
 * Loading message component using Leaflet Control API.
 * NOTE, known limitation: not properly handling parallel loading events. First success will hide element.
 */
const LoadingControl = L.Control.extend({
  options: {
  },

  initialize: function(options) {
    L.setOptions(this, options);
  },

  onAdd: function(map) {
    this.addLayerListeners(map);

    const div = this.options.element;
    this.checkVisiblity(div);
    return div;
  },

  onRemove: function(map) {
    this.removeLayerListeners(map);
  },

  //
  // Custom methods
  //
  inFlight: [],

  onDataLoading: function (event) {
    const id = event.target._leaflet_id;
    this.inFlight.push(id);
    this.checkVisiblity(this._container);
  },
  onDataLoad: function (event) {
    const id = event.target._leaflet_id;
    this.inFlight = this.inFlight.filter(item => item !== id);
    this.checkVisiblity(this._container);
  },

  checkVisiblity: function(element) {
    const isVisible = this.inFlight.length > 0;
    if (isVisible) {
      L.DomUtil.removeClass(element, 'hide');
    } else {
      L.DomUtil.addClass(element, 'hide');
    }
  },

  addLayerLoadListener: function(layer) {
    if (!layer || !layer.on) return;
    layer.on({
      loading: this.onDataLoading,
      load: this.onDataLoad
    }, this);
  },

  removeLayerLoadListener: function(layer) {
    if (!layer || !layer.on) return;
    layer.off({
      loading: this.onDataLoading,
      load: this.onDataLoad
    }, this);
  },

  onLayerAdd: function(event) {
    this.addLayerLoadListener(event.layer);
  },

  onLayerRemove: function(event) {
    this.removeLayerLoadListener(event.layer);
  },

  addLayerListeners: function(map) {
    map.eachLayer(layer => this.addLayerLoadListener(layer));

    map.on({
      layeradd: this.onLayerAdd,
      layerremove: this.onLayerRemove
    }, this);
  },

  removeLayerListeners: function(map) {
    map.eachLayer(layer => this.removeLayerLoadListener(layer));

    map.off({
      layeradd: this.onLayerAdd,
      layerremove: this.onLayerRemove
    }, this);
  },

});

const constructor = function(opts) {
  return new LoadingControl(opts);
};

export default constructor;

