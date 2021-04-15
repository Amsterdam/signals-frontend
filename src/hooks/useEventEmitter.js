// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useCallback } from 'react';

const useEventEmitter = () => {
  const emit = useCallback((name, payload, target = global.document) => {
    const args = [name, payload && { detail: payload }].filter(Boolean);
    const event = new CustomEvent(...args);

    target.dispatchEvent(event);
  }, []);

  const listenFor = useCallback((eventName, callback, target = global.document) => {
    target.addEventListener(eventName, callback);
  }, []);

  const unlisten = useCallback((eventName, callback, target = global.document) => {
    target.removeEventListener(eventName, callback);
  }, []);

  return {
    emit,
    listenFor,
    unlisten,
  };
};

export default useEventEmitter;
