// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import React from 'react';

const initialContext = { districts: undefined };

const IncidentManagementContext = React.createContext(initialContext);

export default IncidentManagementContext;
