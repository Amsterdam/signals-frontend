import React from 'react';

const initialContext = { districts: undefined, sources: undefined };

const IncidentManagementContext = React.createContext(initialContext);

export default IncidentManagementContext;
