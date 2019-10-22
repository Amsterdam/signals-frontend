const LegendControl = L.Control.extend({
  options: {
    startClosedWidth: 600,
    elements: [],
  },

  initialize(options) {
    L.setOptions(this, options);
  },

  onAdd(map) {
    this.isClosed = false;

    if (map.getSize().x < this.options.startClosedWidth) {
      this.isClosed = true;
    }

    const div = L.DomUtil.create('div', 'legend-control');

    const header = L.DomUtil.create('div', 'legend-header', div);
    header.innerText = 'Legenda';

    header.addEventListener('click', () => {
      this.isClosed = !this.isClosed;
      this._setClosed(div);
    });
    this._setClosed(div);

    const content = L.DomUtil.create('div', 'legend-content', div);
    this.options.elements.forEach(element => {
      const item = L.DomUtil.create('div', 'legend-content-item', content);
      const icon = L.DomUtil.create('img', 'legend-content-icon', item);
      icon.src = element.iconUrl;
      const text = L.DomUtil.create('span', 'legend-content-text', item);
      text.innerText = element.label;
    });

    return div;
  },

  _setClosed(element) {
    if (this.isClosed) {
      L.DomUtil.addClass(element, 'is-closed');
      L.DomUtil.removeClass(element, 'is-open');
    } else {
      L.DomUtil.removeClass(element, 'is-closed');
      L.DomUtil.addClass(element, 'is-open');
    }
  },
});

export default LegendControl;
