import L from 'leaflet';
import LoadingControl from './LoadingControl';

describe('Leaflet loading control', () => {
  let map;
  let layer;

  const createControl = (options = {}) => {
    const element = document.createElement('div');
    element.innerText = 'loading.';
    element.className = 'loading-control';
    options.element = element; // eslint-disable-line no-param-reassign

    const mapDiv = document.createElement('div');
    map = L.map(mapDiv);

    layer = L.layerGroup();
    layer.addTo(map);

    const control = new LoadingControl(options);
    control.addTo(map);

    return [element, control];
  };

  it('is hidden if no requests in flight', () => {
    const [element ] = createControl(); // eslint-disable-line array-bracket-spacing

    expect(element.innerText).toBe('loading.');
    expect(element.classList.contains('hide')).toBe(true);
  });

  it('is shown when loading', () => {
    const [element ] = createControl({ foo: 'bar1' }); // eslint-disable-line array-bracket-spacing

    layer.fireEvent('loading');

    expect(element.classList.contains('hide')).toBe(false);
  });

  it('is hidden on load success', () => {
    const [element ] = createControl({ foo: 'bar2' }); // eslint-disable-line array-bracket-spacing

    layer.fireEvent('loading');
    expect(element.classList.contains('hide')).toBe(false);
    layer.fireEvent('load');

    expect(element.classList.contains('hide')).toBe(true);
  });

  it('is hidden on load error', () => {
    const [element ] = createControl(); // eslint-disable-line array-bracket-spacing

    layer.fireEvent('loading');
    expect(element.classList.contains('hide')).toBe(false);
    layer.fireEvent('error');

    expect(element.classList.contains('hide')).toBe(true);
  });

  it('is properly destroyed', () => {
    const [, control] = createControl();
    layer.off = jest.fn();

    control.remove();

    expect(layer.off).toHaveBeenCalled();
  });
});
