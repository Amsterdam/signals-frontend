const BboxGeojsonLayer = L.GeoJSON.extend({
  options: {
    zoomMin: 0,
    zoomMax: 99
  }, // Default options

  //
  // Leaflet layer methods
  //
  initialize(extraOptions, options) {
    L.GeoJSON.prototype.initialize.call(this, undefined, options);
    L.Util.setOptions(this, extraOptions);

    // istanbul ignore next
    if (!this.options.fetchRequest) {
      throw new Error('missing fetchRequest option');
    }
  },

  onAdd(map) {
    this._map = map;

    map.on('moveend', this.onMoveEnd, this);
    map.on('zoomend', this.onZoomEnd, this);
    map.on('refresh', this.onRefresh, this);

    this.fetchNewData();
  },

  onRemove(map) {
    map.off('moveend', this.onMoveEnd, this);
    map.off('zoomend', this.onZoomEnd, this);
    map.off('refresh', this.onRefresh, this);

    // Remove any geometry on this layer
    L.LayerGroup.prototype.onRemove.call(this, map);

    this._map = null;
  },

  //
  // Custom methods
  //
  zoomInRange() {
    const zoom = this._map.getZoom();
    return zoom >= this.options.zoomMin && zoom <= this.options.zoomMax;
  },

  fetchNewData() {
    if (!this.zoomInRange()) {
      // Outside zoom range, not fetching new data
      return;
    }

    this.isLoading = true;
    this.fire('loading');

    const bounds = this._map.getBounds();
    this.options.fetchRequest(bounds.toBBoxString())
      .then((geoData) => {
        this.clearLayers(); // Remove previous geometry
        this.addData(geoData);  // Adds geojson object to this layer

        this.isLoading = false;
        this.fire('load');
      })
      .catch(() => {
        this.isLoading = false;
        this.fire('error');
      });
  },

  onMoveEnd() {
    // Fired after dragging AND zooming!
    this.fetchNewData();
  },

  onZoomEnd() {
    if (!this.zoomInRange()) {
      this.clearLayers(); // Remove previous geometry, new data is fetched by onMoveEnd
    }
  },

  onRefresh() {
    this.fetchNewData();
  },
});

export default function (extraOptions, options) {
  return new BboxGeojsonLayer(extraOptions, options);
}
