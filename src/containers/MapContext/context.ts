import React from 'react';

import { initialState } from './reducer';

interface ContextType {
  state: typeof initialState;
  dispatch?: (action: Record<string, unknown>) => void;
}

export default React.createContext<ContextType>({ state: initialState });
