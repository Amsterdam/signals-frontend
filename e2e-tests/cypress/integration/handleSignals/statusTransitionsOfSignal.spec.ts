import * as requests from '../../support/commandsRequests';
import { CHANGE_STATUS, SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { generateToken } from '../../support/jwt';

describe('All status transitions of a signal', () => {
  describe('Setup data set 01', () => {
    it('Should setup the testdata', () => {
      // Create a random signal
      requests.createSignalDeelmelding();
    });
  });
  describe('Set 01 status transitions', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.stubPreviewMap();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });
    it('Should open the signal', () => {
      cy.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();
    });
    it("Should change status from 'Gemeld' to 'In afwachting van behandeling'", () => {
      cy.changeSignalStatus('Gemeld', 'In afwachting van behandeling', CHANGE_STATUS.radioButtonInAfwachting);
    });
    it("Should change status from 'In afwachting van behandeling' to 'In behandeling'", () => {
      cy.changeSignalStatus('In afwachting van behandeling', 'In behandeling', CHANGE_STATUS.radioButtonInBehandeling);
    });
    it("Should change status from 'In behandeling' to 'Gemeld'", () => {
      cy.changeSignalStatus('In behandeling', 'Gemeld', CHANGE_STATUS.radioButtonGemeld);
    });
    it("Should change status from 'Gemeld' to 'Ingepland'", () => {
      cy.changeSignalStatus('Gemeld', 'Ingepland', CHANGE_STATUS.radioButtonIngepland);
    });
    it("Should change status from 'Ingepland' to 'Extern: verzoek tot afhandeling'", () => {
      cy.changeSignalStatus('Ingepland', 'Verzoek tot afhandeling', CHANGE_STATUS.radioButtonExtern);
    });
    it("Should change status from 'Extern: verzoek tot afhandeling' to 'Afgehandeld'", () => {
      cy.changeSignalStatus('Extern: verzoek tot afhandeling', 'Afgehandeld', CHANGE_STATUS.radioButtonAfgehandeld);
    });
    it("Should change status from 'Afgehandeld' to 'Heropend'", () => {
      cy.changeSignalStatus('Afgehandeld', 'Heropend', CHANGE_STATUS.radioButtonHeropend);
    });
    it("Should change status from 'Heropend' to 'In behandeling'", () => {
      cy.changeSignalStatus('Heropend', 'In behandeling', CHANGE_STATUS.radioButtonInBehandeling);
    });
    it("Should change status from 'In behandeling' to 'Ingepland'", () => {
      cy.changeSignalStatus('In behandeling', 'Ingepland', CHANGE_STATUS.radioButtonIngepland);
    });
    it("Should change status from 'Ingepland' to 'In behandeling'", () => {
      cy.changeSignalStatus('Ingepland', 'In behandeling', CHANGE_STATUS.radioButtonInBehandeling);
    });
    it("Should change status from 'In behandeling' to 'Extern: verzoek tot afhandeling'", () => {
      cy.changeSignalStatus('In behandeling', 'Verzoek tot afhandeling', CHANGE_STATUS.radioButtonExtern);
    });
    it("Should change status from 'Extern: verzoek tot afhandeling' to 'In behandeling'", () => {
      cy.changeSignalStatus('Extern: verzoek tot afhandeling', 'In behandeling', CHANGE_STATUS.radioButtonInBehandeling);
    });
    it("Should change status from 'In behandeling' to 'Afgehandeld'", () => {
      cy.changeSignalStatus('In behandeling', 'Afgehandeld', CHANGE_STATUS.radioButtonAfgehandeld);
    });
  });
  describe('Setup data set 02', () => {
    it('Should setup the testdata', () => {
      // Create a random signal
      requests.createSignalDeelmelding();
    });
  });
  describe('Set 02 status transitions', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.stubPreviewMap();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });
    it('Should open the signal', () => {
      cy.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();
    });

    it("Should change status from 'Gemeld' to 'Geannuleerd'", () => {
      cy.changeSignalStatus('Gemeld', 'Geannuleerd', CHANGE_STATUS.radioButtonGeannuleerd);
    });
    it("Should change status from 'Geannuleerd' to 'Heropend'", () => {
      cy.changeSignalStatus('Geannuleerd', 'Heropend', CHANGE_STATUS.radioButtonHeropend);
    });
    it("Should change status from 'Heropend' to 'Afgehandeld'", () => {
      cy.changeSignalStatus('Heropend', 'Afgehandeld', CHANGE_STATUS.radioButtonAfgehandeld);
    });
  });
  describe('Setup data set 03', () => {
    it('Should setup the testdata', () => {
      // Create a random signal
      requests.createSignalDeelmelding();
    });
  });
  describe('Set 03 status transitions', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.stubPreviewMap();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });
    it('Should open the signal', () => {
      cy.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();
    });

    it("Should change status from 'Gemeld' to 'In afwachting van behandeling'", () => {
      cy.changeSignalStatus('Gemeld', 'In afwachting van behandeling', CHANGE_STATUS.radioButtonInAfwachting);
    });
    it("Should change status from 'In afwachting van behandeling' to 'Ingepland'", () => {
      cy.changeSignalStatus('In afwachting van behandeling', 'Ingepland', CHANGE_STATUS.radioButtonIngepland);
    });
    it("Should change status from 'Ingepland' to 'Extern: verzoek tot afhandeling'", () => {
      cy.changeSignalStatus('Ingepland', 'Verzoek tot afhandeling', CHANGE_STATUS.radioButtonExtern);
    });
    it("Should change status from 'Extern: verzoek tot afhandeling' to 'Geannuleerd'", () => {
      cy.changeSignalStatus('Extern: verzoek tot afhandeling', 'Geannuleerd', CHANGE_STATUS.radioButtonGeannuleerd);
    });
  });
  describe('Setup data set 04', () => {
    it('Should setup the testdata', () => {
      // Create a random signal
      requests.createSignalDeelmelding();
    });
  });
  describe('Set 04 status transitions', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.stubPreviewMap();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });
    it('Should open the signal', () => {
      cy.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();
    });

    it("Should change status from 'Gemeld' to 'In behandeling'", () => {
      cy.changeSignalStatus('Gemeld', 'In behandeling', CHANGE_STATUS.radioButtonInBehandeling);
    });
    it("Should change status from 'In behandeling' to 'Geannuleerd'", () => {
      cy.changeSignalStatus('In behandeling', 'Geannuleerd', CHANGE_STATUS.radioButtonGeannuleerd);
    });
  });
  describe('Set up testdata for signal to THOR', () => {
    it('Should setup the testdata', () => {
      // Create a random signal
      requests.createSignalDeelmelding();
    });
  });
  describe('Send signal to THOR', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.stubPreviewMap();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });
    it('Should open the signal', () => {
      cy.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();
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
