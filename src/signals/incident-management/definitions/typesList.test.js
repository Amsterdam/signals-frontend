// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
jest.mock('shared/services/configuration/configuration');

describe('Types list', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should contain 'Projecten' with useProjectenSignalType enabled", () => {
    const configuration = require('shared/services/configuration/configuration').default;
    configuration.featureFlags.useProjectenSignalType = true;
    const typesList = require('./typesList').default;

    expect(typesList.length).toBe(5);
    expect(typesList[4].value).toBe('Projecten');
    expect(typesList[4].info).toContain('project');
    expect(typesList[4].info).not.toContain('langdurig traject');

    configuration.__reset();
  });

  it("should contain 'Groot onderhoud' by default", () => {
    const typesList = require('./typesList').default;

    expect(typesList.length).toBe(5);
    expect(typesList[4].value).toBe('Groot onderhoud');
    expect(typesList[4].info).toContain('langdurig traject');
    expect(typesList[4].info).not.toContain('project');
  });
});
