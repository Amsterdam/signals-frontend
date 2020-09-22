import { useRef } from 'react';

const useDebounce = (func, wait) => {
  const timeout = useRef(null);

  return function (...args) {
    const that = this;

    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      func.apply(that, args);
      clearTimeout(timeout.current);
    }, wait);
  };
};

export default useDebounce;
