import type { FunctionComponent } from 'react';
import React from 'react';
import type { ContainerSelectValue } from './types';

const initialValue: ContainerSelectValue = {
  selection: [],
  location: [0, 0],
  meta: { endpoint: '', featureTypes: [] },
  update: () => {},
  edit: () => {},
  close: () => {},
};

const ContainerSelectContext = React.createContext(initialValue);

interface ContainerSelectProviderProps {
  value: ContainerSelectValue;
}

export const ContainerSelectProvider: FunctionComponent<ContainerSelectProviderProps> = ({ value, children }) =>
  <ContainerSelectContext.Provider value={value}>{children}</ContainerSelectContext.Provider>;
export default ContainerSelectContext;

