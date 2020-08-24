import L from 'leaflet';
import LegendControl from './LegendControl';

describe('Leaflet legend control', () => {
  let mapDiv;

  const createControl = (options = {}, mockSize = { x: 640, y: 480 }) => {
    mapDiv = document.createElement('div');
    const map = L.map(mapDiv);

    map.getSize = jest.fn().mockImplementation(() => mockSize);

    const control = new LegendControl(options);
    control.addTo(map);

    const containerEl = mapDiv.querySelector('.legend-control');
    return [containerEl, control];
  };

  it('should render correctly with legend open', () => {
    const [containerEl] = createControl({
      elements: [
        {
          iconUrl: 'foo/bar.svg',
          label: 'bar label',
        },
      ],
    });

    expect(containerEl).toMatchSnapshot();
  });

  it('should render correctly with legend closed', () => {
    const [containerEl] = createControl(
      {
        elements: [
          {
            iconUrl: 'foo/bar.svg',
            label: 'bar label',
          },
        ],
      },
      { x: 440, y: 480 }
    );

    expect(containerEl).toMatchSnapshot();
  });

  it('can close', () => {
    const [containerEl, control] = createControl({
      elements: [
        {
          iconUrl: 'foo/bar.svg',
          label: 'bar label',
        },
      ],
    });

    containerEl.querySelector('.legend-header').click();

    expect(control.isClosed).toBe(true);
  });

  it('can open', () => {
    const [containerEl, control] = createControl(
      {
        elements: [
          {
            iconUrl: 'foo/bar.svg',
            label: 'bar label',
          },
        ],
      },
      { x: 440, y: 480 }
    );

    containerEl.querySelector('.legend-header').click();

    expect(control.isClosed).toBe(false);
  });
});
