/**
 * Loading message component using Leaflet Control API.
 * NOTE, known limitation: not properly handling parallel loading events. First success will hide element.
 */
const LoadingControl = L.Control.extend({
  options: {
  },

  initialize(options) {
    L.setOptions(this, options);
  },

  onAdd(map) {
    this.addLayerListeners(map);

    const div = this.options.element;
    this.checkVisiblity(div);
    return div;
  },

  onRemove(map) {
    this.removeLayerListeners(map);
  },

  //
  // Custom methods
  //
  inFlight: [],

  onDataLoading(event) {
    const id = event.target._leaflet_id;
    this.inFlight.push(id);
    this.checkVisiblity(this._container);
  },
  onDataLoad(event) {
    const id = event.target._leaflet_id;
    this.inFlight = this.inFlight.filter((item) => item !== id);
    this.checkVisiblity(this._container);
  },

  checkVisiblity(element) {
    const isVisible = this.inFlight.length > 0;
    if (isVisible) {
      L.DomUtil.removeClass(element, 'hide');
    } else {
      L.DomUtil.addClass(element, 'hide');
    }
  },

  addLayerLoadListener(layer) {
    if (!layer || !layer.on) return;
    layer.on({
      loading: this.onDataLoading,
      load: this.onDataLoad,
      error: this.onDataLoad
    }, this);
  },

  removeLayerLoadListener(layer) {
    if (!layer || !layer.on) return;
    layer.off({
      loading: this.onDataLoading,
      load: this.onDataLoad,
      error: this.onDataLoad
    }, this);
  },

  onLayerAdd(event) {
    this.addLayerLoadListener(event.layer);
  },

  onLayerRemove(event) {
    this.removeLayerLoadListener(event.layer);
  },

  addLayerListeners(map) {
    map.eachLayer((layer) => this.addLayerLoadListener(layer));

    map.on({
      layeradd: this.onLayerAdd,
      layerremove: this.onLayerRemove
    }, this);
  },

  removeLayerListeners(map) {
    map.eachLayer((layer) => this.removeLayerLoadListener(layer));

    map.off({
      layeradd: this.onLayerAdd,
      layerremove: this.onLayerRemove
    }, this);
  },

});

const constructor = (opts) => new LoadingControl(opts);
export default constructor;

