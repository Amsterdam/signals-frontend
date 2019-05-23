import L from 'leaflet';
import LegendControl from './LegendControl';

describe('Leaflet legend control', () => {
  let mapDiv;

  const createControl = (options = {}) => {
    mapDiv = document.createElement('div');
    const map = L.map(mapDiv);

    const control = new LegendControl(options);
    control.addTo(map);

    const containerEl = mapDiv.querySelector('.legend-control');
    return [containerEl, control];
  };

  it('is rendered', () => {
    const [containerEl, ] = createControl({ // eslint-disable-line array-bracket-spacing
      elements: [
        {
          iconUrl: 'foo/bar.svg',
          label: 'bar label',
        }
      ]
    });

    expect(containerEl).toMatchSnapshot();
  });

  it('can close', () => {
    const [containerEl, control] = createControl({ // eslint-disable-line array-bracket-spacing
      elements: [
        {
          iconUrl: 'foo/bar.svg',
          label: 'bar label',
        }
      ]
    });

    containerEl.querySelector('.legend-header').click();

    expect(control.isClosed).toBe(false);
  });
});
