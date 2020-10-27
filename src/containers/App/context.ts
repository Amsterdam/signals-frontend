import React from 'react';

const initialContext = { loading: false, sources: undefined };

const AppContext = React.createContext(initialContext);

export default AppContext;
