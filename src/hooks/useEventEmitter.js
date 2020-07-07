import { useCallback } from 'react';

const useEventEmitter = () => {
  const emit = useCallback((name, payload = {}, target = global.document) => {
    const event = new CustomEvent(name, { detail: payload });
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
