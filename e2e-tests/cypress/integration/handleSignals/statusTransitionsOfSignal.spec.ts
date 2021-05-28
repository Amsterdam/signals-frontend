// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import * as requests from '../../support/commandsRequests';
import { CHANGE_STATUS, SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('All status transitions of a signal', () => {
  describe('Setup data set 01', () => {
    it('Should setup the testdata', () => {
      // Create a random signal
      requests.createSignalRandom();
    });
  });
  describe('Set 01 status transitions', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.stubPreviewMap();
      routes.getManageSignalsRoutes();
      routes.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });
    it('Should open the signal', () => {
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();
    });
    it("Should change status from 'Gemeld' to 'In afwachting van behandeling'", () => {
      createSignal.changeSignalStatus('Gemeld', 'In afwachting van behandeling', CHANGE_STATUS.radioButtonInAfwachting);
    });
    it("Should change status from 'In afwachting van behandeling' to 'In behandeling'", () => {
      createSignal.changeSignalStatus('In afwachting van behandeling', 'In behandeling', CHANGE_STATUS.radioButtonInBehandeling);
    });
    it("Should change status from 'In behandeling' to 'Gemeld'", () => {
      createSignal.changeSignalStatus('In behandeling', 'Gemeld', CHANGE_STATUS.radioButtonGemeld);
    });
    it("Should change status from 'Gemeld' to 'Ingepland'", () => {
      createSignal.changeSignalStatus('Gemeld', 'Ingepland', CHANGE_STATUS.radioButtonIngepland);
    });
    it("Should change status from 'Ingepland' to 'Extern: verzoek tot afhandeling'", () => {
      createSignal.changeSignalStatus('Ingepland', 'Extern: verzoek tot afhandeling', CHANGE_STATUS.radioButtonExtern);
    });
    it("Should change status from 'Extern: verzoek tot afhandeling' to 'Afgehandeld'", () => {
      createSignal.changeSignalStatus('Extern: verzoek tot afhandeling', 'Afgehandeld', CHANGE_STATUS.radioButtonAfgehandeld);
    });
    it("Should change status from 'Afgehandeld' to 'Heropend'", () => {
      createSignal.changeSignalStatus('Afgehandeld', 'Heropend', CHANGE_STATUS.radioButtonHeropend);
    });
    it("Should change status from 'Heropend' to 'In behandeling'", () => {
      createSignal.changeSignalStatus('Heropend', 'In behandeling', CHANGE_STATUS.radioButtonInBehandeling);
    });
    it("Should change status from 'In behandeling' to 'Ingepland'", () => {
      createSignal.changeSignalStatus('In behandeling', 'Ingepland', CHANGE_STATUS.radioButtonIngepland);
    });
    it("Should change status from 'Ingepland' to 'In behandeling'", () => {
      createSignal.changeSignalStatus('Ingepland', 'In behandeling', CHANGE_STATUS.radioButtonInBehandeling);
    });
    it("Should change status from 'In behandeling' to 'Extern: verzoek tot afhandeling'", () => {
      createSignal.changeSignalStatus('In behandeling', 'Extern: verzoek tot afhandeling', CHANGE_STATUS.radioButtonExtern);
    });
    it("Should change status from 'Extern: verzoek tot afhandeling' to 'In behandeling'", () => {
      createSignal.changeSignalStatus('Extern: verzoek tot afhandeling', 'In behandeling', CHANGE_STATUS.radioButtonInBehandeling);
    });
    it("Should change status from 'In behandeling' to 'Afgehandeld'", () => {
      createSignal.changeSignalStatus('In behandeling', 'Afgehandeld', CHANGE_STATUS.radioButtonAfgehandeld);
    });
  });
  describe('Setup data set 02', () => {
    it('Should setup the testdata', () => {
      // Create a random signal
      requests.createSignalRandom();
    });
  });
  describe('Set 02 status transitions', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.stubPreviewMap();
      routes.getManageSignalsRoutes();
      routes.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });
    it('Should open the signal', () => {
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();
    });

    it("Should change status from 'Gemeld' to 'Geannuleerd'", () => {
      createSignal.changeSignalStatus('Gemeld', 'Geannuleerd', CHANGE_STATUS.radioButtonGeannuleerd);
    });
    it("Should change status from 'Geannuleerd' to 'Heropend'", () => {
      createSignal.changeSignalStatus('Geannuleerd', 'Heropend', CHANGE_STATUS.radioButtonHeropend);
    });
    it("Should change status from 'Heropend' to 'Afgehandeld'", () => {
      createSignal.changeSignalStatus('Heropend', 'Afgehandeld', CHANGE_STATUS.radioButtonAfgehandeld);
    });
  });
  describe('Setup data set 03', () => {
    it('Should setup the testdata', () => {
      // Create a random signal
      requests.createSignalRandom();
    });
  });
  describe('Set 03 status transitions', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.stubPreviewMap();
      routes.getManageSignalsRoutes();
      routes.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });
    it('Should open the signal', () => {
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();
    });

    it("Should change status from 'Gemeld' to 'In afwachting van behandeling'", () => {
      createSignal.changeSignalStatus('Gemeld', 'In afwachting van behandeling', CHANGE_STATUS.radioButtonInAfwachting);
    });
    it("Should change status from 'In afwachting van behandeling' to 'Ingepland'", () => {
      createSignal.changeSignalStatus('In afwachting van behandeling', 'Ingepland', CHANGE_STATUS.radioButtonIngepland);
    });
    it("Should change status from 'Ingepland' to 'Extern: verzoek tot afhandeling'", () => {
      createSignal.changeSignalStatus('Ingepland', 'Extern: verzoek tot afhandeling', CHANGE_STATUS.radioButtonExtern);
    });
    it("Should change status from 'Extern: verzoek tot afhandeling' to 'Geannuleerd'", () => {
      createSignal.changeSignalStatus('Extern: verzoek tot afhandeling', 'Geannuleerd', CHANGE_STATUS.radioButtonGeannuleerd);
    });
  });
  describe('Setup data set 04', () => {
    it('Should setup the testdata', () => {
      // Create a random signal
      requests.createSignalRandom();
    });
  });
  describe('Set 04 status transitions', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.stubPreviewMap();
      routes.getManageSignalsRoutes();
      routes.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });
    it('Should open the signal', () => {
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();
    });

    it("Should change status from 'Gemeld' to 'In behandeling'", () => {
      createSignal.changeSignalStatus('Gemeld', 'In behandeling', CHANGE_STATUS.radioButtonInBehandeling);
    });
    it("Should change status from 'In behandeling' to 'Geannuleerd'", () => {
      createSignal.changeSignalStatus('In behandeling', 'Geannuleerd', CHANGE_STATUS.radioButtonGeannuleerd);
    });
  });
  describe('Set up testdata for signal to THOR', () => {
    it('Should setup the testdata', () => {
      // Create a random signal
      requests.createSignalRandom();
    });
  });
  describe('Send signal to THOR', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.stubPreviewMap();
      routes.getManageSignalsRoutes();
      routes.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });
    it('Should open the signal', () => {
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();
      cy.get(SIGNAL_DETAILS.buttonTHOR).click();
      cy.get(SIGNAL_DETAILS.status)
        .should('contain', 'naar extern systeem')
        .and('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });
    });
  });
});
