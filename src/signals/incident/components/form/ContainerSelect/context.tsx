import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import type { ContainerSelectValue } from './types';

const initialValue: ContainerSelectValue = {
  selection: [],
  update: () => {},
  edit: () => {},
  close: () => {},
};

const ContainerSelectContext = React.createContext(initialValue);

interface ContainerSelectProviderProps {
  value: ContainerSelectValue;
  children: ReactNode;
}

export const ContainerSelectProvider: FunctionComponent<ContainerSelectProviderProps> = ({ value, children }) =>
  <ContainerSelectContext.Provider value={value}>{children}</ContainerSelectContext.Provider>;
export default ContainerSelectContext;
