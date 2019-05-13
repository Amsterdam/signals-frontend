import L from 'leaflet';
import ZoomMessageControl from "./ZoomMessageControl";

describe('Leaflet zoom control', () => {
  let map;

  const createControl = (zoom, options = {}) => {
    const mapDiv = document.createElement('div');
    map = L.map(mapDiv);
    map.getZoom = jest.fn(() => zoom);

    const control = new ZoomMessageControl(options);
    control.addTo(map);

    const containerEl = mapDiv.querySelector('.zoom-control');
    return [containerEl, control];
  };

  it('is checks visibility on load', () => {
    const [containerEl, ] = createControl(4, { zoomMin: 3 });

    expect(containerEl.innerText).toBe('Zoom in om de objecten te zien');
    expect(containerEl.classList.contains('zoom-control')).toBe(true);
    expect(containerEl.classList.contains('hide')).toBe(true);
  });

  it('updates visibility on zoomend', () => {
    const [containerEl, ] = createControl(4, { zoomMin: 3 });

    map.getZoom.mockReturnValue(2);
    map.fire('zoomend');

    expect(containerEl.classList.contains('hide')).toBe(false);
  });

  it('removes listener on destroy', () => {
    const [_, control] = createControl(4, { zoomMin: 3 });

    map.off = jest.fn();

    control.remove();

    expect(map.off).toHaveBeenCalled();
  });
});
