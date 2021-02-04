declare namespace Cypress {
  interface Chainable {

    /**
     * Custom command to add a note to a signal.
     * @example cy.addnote('This is a note');
    */
    addNote: (noteText: string) => Chainable<Element>;

    /**
     * Custom command to change the status of a signal.
     * @example cy.changeSignalStatus('Gemeld', 'In afwachting van behandeling', CHANGE_STATUS.radioButtonInAfwachting);
    */
    changeSignalStatus: (initialStatus: string, newStatus: string, radioButton: string) => Chainable<Element>;

    /**
     * Custom command to check if all details of a signal are visible.
     * @example cy.checkAllDetails('../fixtures/signals/fietsNietje.json');
    */
    checkAllDetails: (signal: signal.RootObject) => Chainable<Element>;

    /**
     * Custom command to check if the creation date on the signal details page is today's date.
     * @example cy.checkCreationDate();
    */
    checkCreationDate: () => Chainable<Element>;

    /**
     * Custom command to check if all general information of a deelmelding is visible.
     * @example cy.checkDeelmelding('1', 'Snel varen', 'Gemeld', '3 werkdagen');
    */
    checkDeelmelding: (deelmeldingNumber: string, subcategory: string, status: string, handlingTime: string) => Chainable<Element>;

    /**
     * Custom command to check if a specific status of the deelmelding is visible.
     * @example cy.checkDeelmeldingStatus('Gemeld');
    */
    checkDeelmeldingStatus: (status: string) => Chainable<Element>;

    /**
     * Custom command to check if all the general elements of the description page are visible.
     * @example cy.checkDescriptionPage();
    */
    checkDescriptionPage: () => Chainable<Element>;

    /**
     * Custom command to check if all directing departments of a signal are visible in the signal details.
     * @example cy.checkDepartments();
    */
    checkDepartments: (signal: signal.RootObject) => Chainable<Element>;

    /**
     * Custom command to check if a detail of a signal is flashing yellow after changing it.
     * @example cy.checkFlashingYellow();
    */
    checkFlashingYellow: () => Chainable<Element>;

    /**
     * Custom command to check if all elements of the header and footer are visible.
     * @example cy.checkHeaderFooter();
    */
    checkHeaderFooter: () => Chainable<Element>;

    /**
     * Custom command to check if a h1 element contains a text and is visible.
     * @example cy.checkHeaderText('Check this header');
    */
    checkHeaderText: (header: string) => Chainable<Element>;

    /**
     * Custom command to check if a status text is red and visible.
     * @example cy.checkRedTextStatus('Gemeld');
    */
    checkRedTextStatus: (status: string) => Chainable<Element>;

    /**
     * Custom command to check if all questions and answers of a signal are visible.
     * @example cy.checkQuestions('../fixtures/signals/fietsNietje.json');
    */
    checkQuestions: (signal: signal.RootObject) => Chainable<Element>;

    /**
     * Custom command to check if all general elements on the signal detail page are visible.
     * @example cy.checkSignalDetailsPage();
    */
    checkSignalDetailsPage: () => Chainable<Element>;

    /**
     * Custom command to check if a signal is not visible in the list of signals.
     * @example cy.checkSignalNotVisible();
    */
    checkSignalNotVisible: () => Chainable<Element>;

    /**
     * Custom command to check if the specific elements of the signaltype are visible.
     * @example cy.checkSignalType('melding');
     * @example cy.checkSignalType('hoofdmelding');
     * @example cy.checkSignalType('deelmelding');
    */
    checkSignalType: (signalType: string) => Chainable<Element>;

    /**
     * Custom command to check if a source is correct and visible in the signal details.
     * @example cy.checkSource('online');
    */
    checkSource: (source: string) => Chainable<Element>;

    /**
     * Custom command to check if all general elements on the specific questions page are visible.
     * @example cy.checkSpecificInformationPage('../fixtures/signals/fietsNietje.json');
    */
    checkSpecificInformationPage: (signal: signal.RootObject) => Chainable<Element>;

    /**
     * Custom command to check if all elements on the summary page are visible.
     * @example cy.checkSummaryPage('../fixtures/signals/fietsNietje.json');
    */
    checkSummaryPage: (signal: signal.RootObject) => Chainable<Element>;

    /**
     * Custom command to check if all general elements on the thanks page are visible.
     * @example cy.checkThanksPage();
    */
    checkThanksPage: () => Chainable<Element>;

    /**
     * Custom command to filter signals by a category slug.
     * @example cy.filterByCategorySlug('overig-afval', 'Overig afval');
    */
    filterByCategorySlug: (selector: string, category: string) => Chainable<Element>;

    /**
     * Custom command to filter signals by a specific attribute.
     * @example cy.filterCategory(FILTER_ALL_ITEMS.selectAllStatus, 'status');
    */
    filterCategory: (selector: string, category: string) => Chainable<Element>;

    /**
     * Custom command to filter signals by a specific signaltype.
     * @example cy.filterSignalOnType('Hoofdmelding', FILTER.checkboxHoofdmelding);
    */
    filterSignalOnType: (type: string, selector: string) => Chainable<Element>;

    /**
     * Custom command to open a previousely (in the same test) created signal.
     * @example cy.openCreatedSignal();
    */
    openCreatedSignal: () => Chainable<Element>;

    /**
     * Custom command to open the menu.
     * @example cy.openMenu();
    */
    openMenu: () => Chainable<Element>;

    /**
     * Custom command to save the signal ID for later user.
     * @example cy.saveSignalId();
    */
    saveSignalId: () => Chainable<Element>;

    /**
     * Custom command to search for an address.
     * @example cy.searchAddress('1012AB 1');
    */
    searchAddress: (address: string) => Chainable<Element>;

    /**
     * Custom command to search signals with a searchterm and check if a selector contains the searchtext.
     * @example cy.searchAndCheck('Pakjesboot', SIGNAL_DETAILS.descriptionText);
    */
    searchAndCheck: (searchTerm: string, selector: string) => Chainable<Element>;

    /**
     * Custom command to select an address from the autosuggest results.
     * @example cy.selectAddress('Bethaniënstraat 12, 1012CA Amsterdam');
    */
    selectAddress: (address: string) => Chainable<Element>;

    /**
     * Custom command to select a lamp on the map, based on coordinates.
     * @example cy.selectLampOnCoordinate(414, 135);
    */
    selectLampOnCoordinate: (coordinateA: number, coordinateB: number) => Chainable<Element>;

    /**
     * Custom command to select a source based on its index in the dropdown.
     * @example cy.selectSource(1);
    */
    selectSource: (index: number) => Chainable<Element>;

    /**
     * Custom command to search and select an address.
     * @example cy.setAddress('../fixtures/signals/fietsNietje.json');
    */
    setAddress: (signal: signal.RootObject) => Chainable<Element>;

    /**
     * Custom command to set the date and time of a signal.
     * @example cy.setDateTime('Nu');
     * @example cy.setDateTime('Vandaag');
     * @example cy.setDateTime('Eerder');
    */
    setDateTime: (dateTime: string) => Chainable<Element>;

    /**
     * Custom command to fill in the deelmelding.
     * @example cy.setDeelmelding('2', '2', 'Brug', 'De Berlagebrug is stuk.');
    */
    setDeelmelding: (id: string, deelmeldingNumber: string, subcategory: string, description: string) => Chainable<Element>;

    /**
     * Custom command to input the description of a signal.
     * @example cy.setDescription('This is a description of the signal');
    */
    setDescription: (description: string) => Chainable<Element>;

    /**
     * Custom command to input all the data on the description page.
     * @example cy.setDescriptionPage('../fixtures/signals/fietsNietje.json');
    */
    setDescriptionPage: (signal: signal.RootObject) => Chainable<Element>;

    /**
     * Custom command to set the email address.
     * @example cy.setEmailAddress('../fixtures/signals/fietsNietje.json');
    */
    setEmailAddress: (signal: signal.RootObject) => Chainable<Element>;

    /**
     * Custom command to set the phonenumber.
     * @example cy.setPhonenumber('../fixtures/signals/fietsNietje.json');
    */
    setPhonenumber: (signal: signal.RootObject) => Chainable<Element>;

    /**
     * Custom command to set the resolution for the test.
     * @example cy.setResolution([375, 812]);
     * @example cy.setResolution('iphone-6');
    */
    setResolution: (size: number[] | string) => Chainable<Element>;

    /**
     * Custom command to upload 0 or more files belonging to a signal.
     * @example cy.uploadAllFiles('../fixtures/signals/fietsNietje.json');
    */
    uploadAllFiles: (signal: signal.RootObject) => Chainable<Element>;

  }
}
