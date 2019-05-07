const ErrorControl = L.Control.extend({
  options: {
    message: 'Oops, something went wrong'
  },

  initialize: function(options) {
    L.setOptions(this, options);
  },

  onAdd: function(map) {
    const div = L.DomUtil.create('div', 'error-control');
    div.innerText = this.options.message;
    L.DomUtil.addClass(div, 'hide');
    return div;
  },

  show: function() {
    L.DomUtil.removeClass(this._container, 'hide');
  },

  hide: function() {
    L.DomUtil.addClass(this._container, 'hide');
  }
});

const constructor = function(opts) {
  return new ErrorControl(opts);
};

export default constructor;

