// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import {DJANGO} from '../support/selectorsDjangoAdmin';
import { REACTIE_MELDER } from '../support/texts';

/**
 * Custom command to check if template exists and add if not exists.
 * @example cy.checkAndAddTemplate('Send mail signal reaction requested');
*/
export const checkAndAddTemplate = (emailTemplate: string, bodyText: string) => {
  cy.get(DJANGO.templateList).then(list => {
    if (list.find(DJANGO.checkboxTemplate).length > 0) {
      cy.get(DJANGO.templateListItem).then($list => {
        if ($list.text().includes(emailTemplate)) {
          cy.log('Template already exists');
        }
        else {
          cy.log('Template does not exist')
          addTemplate(emailTemplate, bodyText);
        }
      })
    }
    else {
      cy.log('No template exist')
      addTemplate(emailTemplate, bodyText);
    }
  });
};

/**
 * Custom command to add an enailtemplate in Django Admin.
 * @example cy.addTemplate('Send mail signal reaction requested');
*/
export const addTemplate = (emailTemplate: string, bodyText: string) => {
  cy.get(DJANGO.linkEmailTemplateAdd).eq(1).click();
  cy.get(DJANGO.selectEmailKey).select(emailTemplate);
  cy.get(DJANGO.inputEmailTitle).type('Uw melding {{ formatted_signal_id }}', { parseSpecialCharSequences: false });
  cy.get(DJANGO.inputEmailBody).type(bodyText, { parseSpecialCharSequences: false });
  cy.get(DJANGO.buttonSave).click();

};