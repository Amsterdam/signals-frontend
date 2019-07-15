import React from 'react';
import { mount } from 'enzyme';
import { Switch } from 'react-router-dom';
import { MemoryRouter } from 'react-router';
import Router from './router';
import KtoContainer from '../../signals/incident/containers/KtoContainer';

jest.mock('../../signals/incident-management', () => () => <div>IncidentManagementModule</div>);
jest.mock('../../signals/incident/containers/IncidentContainer', () => () => <div>IncidentContainer</div>);
jest.mock('../../signals/incident/containers/KtoContainer', () => () => <div>KtoContainer</div>);
jest.mock('containers/NotFoundPage', () => () => <div>NotFound</div>);

describe('routing', () => {
  it('can navigate to kto form', () => {
    const wrapper = mount(
      <MemoryRouter initialIndex={0} initialEntries={['/kto/ja/12345-abcsde']}>
        <Router />
      </MemoryRouter>
    );

    expect(wrapper.find(Switch).length).toBe(1);
    expect(wrapper.find(KtoContainer).length).toBe(1);
  });
});
