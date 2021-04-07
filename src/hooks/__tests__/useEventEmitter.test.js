// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks';

import useEventEmitter from '../useEventEmitter';

jest.spyOn(global.document, 'dispatchEvent');
jest.spyOn(global.document, 'addEventListener');
jest.spyOn(global.document, 'removeEventListener');

describe('hooks/useEventEmitter', () => {
  beforeEach(() => {
    global.document.dispatchEvent.mockReset();
    global.document.addEventListener.mockReset();
    global.document.removeEventListener.mockReset();
    global.CustomEvent = jest.fn((...params) => new Event(...params));
  });

  it('creates a custom event on the document', () => {
    const { result } = renderHook(() => useEventEmitter());

    expect(global.document.dispatchEvent).not.toHaveBeenCalled();

    const name = 'FooBar';
    result.current.emit(name);

    expect(global.document.dispatchEvent).toHaveBeenCalledWith(new Event(name));
  });

  it('creates a custom event with payload', () => {
    const { result } = renderHook(() => useEventEmitter());

    expect(global.document.dispatchEvent).not.toHaveBeenCalled();

    const name = 'BarBaz';
    const payload = { hereBe: 'dragons' };
    result.current.emit(name, payload);

    expect(global.document.dispatchEvent).toHaveBeenCalledWith(new Event(name, { detail: payload }));
  });

  it('creates a custom event on an element', () => {
    const { result } = renderHook(() => useEventEmitter());

    expect(global.CustomEvent).not.toHaveBeenCalled();

    const target = document.createElement('div');
    document.body.appendChild(target);

    jest.spyOn(target, 'dispatchEvent');

    expect(target.dispatchEvent).not.toHaveBeenCalled();

    const name = 'BazQux';
    result.current.emit(name, undefined, target);

    expect(global.CustomEvent).toHaveBeenCalledWith(name);
    expect(target.dispatchEvent).toHaveBeenCalledWith(new Event(name));
  });

  it('registers a listener on the document', () => {
    const { result } = renderHook(() => useEventEmitter());

    expect(global.document.addEventListener).not.toHaveBeenCalled();

    const callback = () => {};
    const name = 'Zork';
    result.current.listenFor(name, callback);

    expect(global.document.addEventListener).toHaveBeenCalledWith(name, callback);
  });

  it('registers a listener on an element', () => {
    const { result } = renderHook(() => useEventEmitter());

    const target = document.createElement('div');
    document.body.appendChild(target);

    jest.spyOn(target, 'addEventListener');

    expect(target.addEventListener).not.toHaveBeenCalled();

    const callback = () => {};
    const name = 'Bazzz';
    result.current.listenFor(name, callback, target);

    expect(target.addEventListener).toHaveBeenCalledWith(name, callback);
  });

  it('removes a listener on the document', () => {
    const { result } = renderHook(() => useEventEmitter());
    const callback = () => {};
    const name = 'Zork';

    result.current.listenFor(name, callback);

    expect(global.document.removeEventListener).not.toHaveBeenCalled();

    result.current.unlisten(name, callback);

    expect(global.document.removeEventListener).toHaveBeenCalledWith(name, callback);
  });

  it('removes a listener on an element', () => {
    const { result } = renderHook(() => useEventEmitter());

    const target = document.createElement('div');
    document.body.appendChild(target);

    jest.spyOn(target, 'removeEventListener');

    const callback = () => {};
    const name = 'Zork';

    result.current.listenFor(name, callback, target);

    expect(target.removeEventListener).not.toHaveBeenCalled();

    result.current.unlisten(name, callback, target);

    expect(target.removeEventListener).toHaveBeenCalledWith(name, callback);
  });
});
