import React from 'react';
import * as reactRedux from 'react-redux';
import { render, fireEvent, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import { resetExtraState, updateIncident } from 'signals/incident/containers/IncidentContainer/actions';

import Input from './InputUsingDispatch';

const dispatch = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);

describe('signals/incident/components/form/RadioInput/InputUsingDispatch', () => {
  beforeEach(() => {
    dispatch.mockReset();
  });

  it('renders an input element', () => {
    const idAttr = 'FooBar';
    render(withAppContext(<Input id="fooBrrr" idAttr={idAttr} label="Label" name="Zork" />));

    expect(document.getElementById(idAttr)).toBeInTheDocument();
  });

  it('dispatches updateIncident', () => {
    const name = 'Zork';
    const id = 'fooBrrr';
    const label = 'Label';
    const info = 'info text';

    render(withAppContext(<Input id={id} idAttr="FooBar" label={label} name={name} info={info} />));

    expect(dispatch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(document.querySelector('input[type=radio]'));
    });

    expect(dispatch).toHaveBeenCalledWith(
      updateIncident({
        [name]: {
          id,
          label,
          info,
        },
      })
    );
  });

  it('dispatches resetExtraState', () => {
    const { rerender } = render(withAppContext(<Input id="fooBrrr" idAttr="FooBar" label="Label" name="Zork" />));

    expect(dispatch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(document.querySelector('input[type=radio]'));
    });

    expect(dispatch).not.toHaveBeenCalledWith(resetExtraState());

    rerender(withAppContext(<Input id="fooBrrr" idAttr="FooBar" label="Label" name="Zork" resetsStateOnChange />));

    act(() => {
      fireEvent.click(document.querySelector('input[type=radio]'));
    });

    expect(dispatch).toHaveBeenCalledWith(resetExtraState());
  });
});
