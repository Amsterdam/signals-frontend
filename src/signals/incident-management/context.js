import React from 'react';

const initialContext = { districts: undefined, users: undefined };

const IncidentManagementContext = React.createContext(initialContext);

export default IncidentManagementContext;
