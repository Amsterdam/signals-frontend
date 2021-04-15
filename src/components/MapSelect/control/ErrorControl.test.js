// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import L from 'leaflet';
import ErrorControl from './ErrorControl';

describe('Leaflet error control', () => {
  let mapDiv;

  const createControl = (options = {}) => {
    mapDiv = document.createElement('div');
    const map = L.map(mapDiv);

    const control = new ErrorControl(options);
    control.addTo(map);

    const containerEl = mapDiv.querySelector('.error-control');
    return [containerEl, control];
  };

  it('is accepts message option', () => {
    const [containerEl ] = createControl({ message: 'foo' }); // eslint-disable-line array-bracket-spacing

    expect(containerEl.innerText).toBe('foo');
    expect(containerEl.classList.contains('error-control')).toBe(true);
    expect(containerEl.classList.contains('hide')).toBe(true);
  });

  it('can be shown', () => {
    const [containerEl, control] = createControl();

    control.show();

    expect(containerEl.classList.contains('hide')).toBe(false);
  });

  it('can be hidden', () => {
    const [containerEl, control] = createControl();

    control.show();
    control.hide();

    expect(containerEl.classList.contains('hide')).toBe(true);
  });
});
