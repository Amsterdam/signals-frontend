import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import type { ContainerSelectValue } from './types';

const initialValue: Partial<ContainerSelectValue> = {
  selection: [],
  update: () => { },
};

const ContainerSelectContext = React.createContext(initialValue);

interface ContainerSelectProviderProps {
  value: Partial<ContainerSelectValue>;
  children: ReactNode;
}

export const ContainerSelectProvider: FunctionComponent<ContainerSelectProviderProps> = ({ value, children }) =>
  <ContainerSelectContext.Provider value={value}>{children}</ContainerSelectContext.Provider>;
export default ContainerSelectContext;
