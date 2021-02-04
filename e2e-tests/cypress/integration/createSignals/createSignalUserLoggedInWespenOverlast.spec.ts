import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/wespen.json';
import questions from '../../fixtures/questions/questions.json';

describe('Create signal "Wespen" when logged in and check signal details', () => {
  describe('Create signal wespen', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });
    it('Should initiate create signal from manage', () => {
      cy.stubMap();
      cy.getManageSignalsRoutes();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.openMenu();
      cy.contains('Melden').click();
      cy.checkHeaderText('Beschrijf uw melding');
    });
    it('Should create the signal', () => {
      cy.stubPreviewMap();
      cy.postSignalRoutePrivate();

      cy.setDescriptionPage(signal);

      // Check Urgency texts
      cy.contains('Wat is de urgentie?').should('be.visible');
      cy.contains('Hoog').should('be.visible').click();
      cy.contains('Hoog: melding met spoed oppakken').should('be.visible');
      cy.contains('Laag').should('be.visible').click();
      cy.contains('Laag: interne melding zonder servicebelofte').should('be.visible');
      cy.contains('Normaal').should('be.visible').click();

      cy.contains('Volgende').click();
      cy.checkSpecificInformationPage(signal);

      Object.values(questions.overlastVanDieren.extra_dieren_text.answers).forEach((elementValue: string) => {
        cy.contains(elementValue).should('be.visible');
      });
      cy.contains('Dierenambulance Amsterdam').should('have.attr', 'href').and('include', 'dierenambulance-amsterdam');
      cy.contains('overlast van dieren').should('have.attr', 'href').and('include', 'veelgevraagd');

      cy.contains('Volgende').click();
      cy.setPhonenumber(signal);
      cy.contains('Volgende').click();

      cy.setEmailAddress(signal);
      cy.contains('Volgende').click();

      cy.checkSummaryPage(signal);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPrivate');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

      cy.checkThanksPage();
      cy.saveSignalId();
    });
  });
  describe('Check data created signal', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      cy.stubPreviewMap();
      cy.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      cy.checkAllDetails(signal);
    });
  });
});
