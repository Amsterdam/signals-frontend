import { createContext } from 'react';

const defaultConfig = {
  isLoading: true,
};

const ConfigContext = createContext(defaultConfig);

export default ConfigContext;
