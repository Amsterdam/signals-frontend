import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';

import IncidentDetailContext from '../../context';

import ChangeValue from '.';

jest.mock('shared/services/list-helper/list-helper');

const expectInitialState = async ({ queryByTestId, findByTestId }) => {
  const editButton = await findByTestId('editMockTypeButton');

  expect(editButton).toBeInTheDocument();
  expect(queryByTestId('changeValueForm')).not.toBeInTheDocument();
};

const expectEditState = async ({ queryByTestId, findByTestId }) => {
  const editButton = queryByTestId('editMockTypeButton');

  const changeValueForm = await findByTestId('changeValueForm');

  expect(editButton).not.toBeInTheDocument();
  expect(changeValueForm).toBeInTheDocument();
};

const props = {
  list: [
    { key: 'c', value: 'Cee', description: 'Foo bar baz' },
    { key: 'b', value: 'Bee' },
    { key: 'a', value: 'Aaaaaaaa', description: 'Zork' },
  ],
  display: 'De letter',
  path: 'incident.mockPath',
  sort: false,
  type: 'mockType',
};

const update = jest.fn();

const renderWithContext = (componentProps = props) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ incident: { ...incidentFixture, someValue: 'c' }, update }}>
      <ChangeValue {...componentProps} />
    </IncidentDetailContext.Provider>
  );

describe('ChangeValue', () => {
  // data-testid attributes are generated dynamically
  const editTestId = `edit${props.type.charAt(0).toUpperCase()}${props.type.slice(1)}Button`;
  const submitTestId = `submit${props.type.charAt(0).toUpperCase()}${props.type.slice(1)}Button`;
  const cancelTestId = `cancel${props.type.charAt(0).toUpperCase()}${props.type.slice(1)}Button`;

  beforeEach(() => {
    update.mockReset();
    getListValueByKey.mockImplementation(() => 'mock waarde');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', async () => {
    const renderProps = render(renderWithContext());

    await expectInitialState(renderProps);

    fireEvent.click(renderProps.getByTestId(editTestId));

    await expectEditState(renderProps);
  });

  it('should call update', async () => {
    const { getByTestId, findByTestId } = render(renderWithContext());

    const editButton = getByTestId(editTestId);

    fireEvent.click(editButton);

    const submitBtn = await findByTestId(submitTestId);

    expect(update).not.toHaveBeenCalled();

    fireEvent.click(submitBtn);

    expect(update).toHaveBeenCalledWith({
      type: props.type,
      patch: {
        incident: expect.any(Object),
      },
    });
  });

  it('should call update with extra props', async () => {
    const { getByTestId, findByTestId } = render(renderWithContext({ ...props, patch: { extraProp: true } }));

    const editButton = getByTestId(editTestId);

    fireEvent.click(editButton);

    const submitBtn = await findByTestId(submitTestId);

    expect(update).not.toHaveBeenCalled();

    fireEvent.click(submitBtn);

    expect(update).toHaveBeenCalledWith({
      type: props.type,
      patch: {
        incident: expect.any(Object),
        extraProp: true,
      },
    });
  });

  it('should hide form on cancel', async () => {
    const renderProps = render(renderWithContext());

    await expectInitialState(renderProps);

    fireEvent.click(renderProps.getByTestId(editTestId));

    await expectEditState(renderProps);

    fireEvent.click(renderProps.getByTestId(cancelTestId));

    await expectInitialState(renderProps);
  });

  it('should hide form on ESC', async () => {
    const renderProps = render(renderWithContext());

    await expectInitialState(renderProps);

    fireEvent.click(renderProps.getByTestId(editTestId));

    await expectEditState(renderProps);

    fireEvent.keyUp(document, { key: 'ArrowUp', code: 38, keyCode: 38 });

    await expectEditState(renderProps);

    fireEvent.keyUp(document, { key: 'Escape', code: 13, keyCode: 13 });

    await expectInitialState(renderProps);

    fireEvent.click(renderProps.getByTestId(editTestId));

    await expectEditState(renderProps);

    fireEvent.keyUp(document, { key: 'Esc', code: 13, keyCode: 13 });

    await expectInitialState(renderProps);
  });

  it('should render info text', async () => {
    const renderProps = render(renderWithContext({ ...props, infoKey: 'description' }));

    await expectInitialState(renderProps);

    fireEvent.click(renderProps.getByTestId(editTestId));

    expect(renderProps.queryByTestId('infoText')).not.toBeInTheDocument();

    renderProps.unmount();

    renderProps.rerender(renderWithContext({ ...props, infoKey: 'description', valuePath: 'someValue' }));

    await expectInitialState(renderProps);

    fireEvent.click(renderProps.getByTestId(editTestId));

    expect(renderProps.queryByTestId('infoText')).toBeInTheDocument();
    expect(renderProps.queryByTestId('infoText').textContent).toEqual('Foo bar baz');

    fireEvent.change(document.querySelector('select'), { target: { value: 'a' } });

    expect(renderProps.queryByTestId('infoText').textContent).toEqual('Zork');
  });

  it('should render disabled edit button', async () => {
    const renderProps = render(renderWithContext({ ...props, disabled: true }));

    await expectInitialState(renderProps);

    fireEvent.click(renderProps.getByTestId(editTestId));

    await expectInitialState(renderProps);
  });
});
