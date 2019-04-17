const LegendControl = L.Control.extend({
  options: {
    elements: []
  },

  initialize: function(options) {
    L.setOptions(this, options);
  },

  onAdd: function(map) {
    const div = L.DomUtil.create('div', 'legend-control');

    const header = L.DomUtil.create('div', 'legend-header', div);
    header.innerText = "Legenda";

    const content = L.DomUtil.create('div', 'legend-content', div);
    content.innerText = "";

    for (const element of this.options.elements) {
      const item = L.DomUtil.create('div', 'legend-content-item', content);
      const icon = L.DomUtil.create('img', 'legend-content-icon', item);
      icon.src = element.iconUrl;
      const text = L.DomUtil.create('span', 'legend-content-text', item);
      text.innerText = element.label;
    }

    return div;
  }
});

const constructor = function(opts) {
  return new LegendControl(opts);
};

export default constructor;

