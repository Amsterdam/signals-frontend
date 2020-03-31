// Selectors for Manage Signals page
export const MANAGE_SIGNALS = {
    buttonMijnFilters: '[data-testid=myFiltersModalBtn]',
    buttonCloseMijnFilters: '[data-testid=closeBtn]',
    buttonFilteren: '[data-testid=filterModalBtn]',
    firstSignalStadsdeelName: ':nth-child(1) > :nth-child(4) > a',
    filterTagList: '[data-testid=filterTagListTag]',
    refreshIcon: '.PageHeader__RefreshIcon-qfwsv1-0'
}

// Selectors for Filteren page
export const FILTER = {
    buttonSubmitFilter: '[data-testid=submitBtn]',
    buttonNieuwFilter: '[data-testid=resetBtn]',
    buttonCancel: '[data-testid=cancelBtn]',
    checkboxRefresh: '#filter_refresh',
    checkboxGemeld: '#status_m',
    inputFilterName: '#filter_name'
}

// Selectors on filter page for selection of all elements per category
export const FILTER_ALL_ITEMS = {
    selectAllStatus: '[data-testid=statusCheckboxGroup] > [data-testid=checkboxList] > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllStadsdelen: '[data-testid=stadsdeelCheckboxGroup] > [data-testid=checkboxList] > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllSource: '[data-testid=sourceCheckboxGroup] > [data-testid=checkboxList] > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllGarbage: ':nth-child(3) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllCivilConstructs: ':nth-child(4) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllSubversion: ':nth-child(5) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllPublicParksWater: ':nth-child(6) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllOther: ':nth-child(7) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllDisturbanceCompanies: ':nth-child(8) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllDisturbancePublicSpace: ':nth-child(9) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllDisturbanceWater: ':nth-child(10) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllDisturbanceAnimals: ':nth-child(11) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllDisturbancePersonsGroups: ':nth-child(12) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllClean: ':nth-child(13) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllRoadsTraffic: ':nth-child(14) > .CheckboxList__Toggle-sc-10jaknx-1',
    selectAllLiving: ':nth-child(15) > .CheckboxList__Toggle-sc-10jaknx-1'
}

// Selectors for Mijn Filters page
export const MY_FILTERS = {
    buttonDeleteFilter: '[data-testid=handleRemoveFilterButton]'
}

// Selector for Menu items
export const MENU_ITEMS = {
    openMenu: '.sc-lhVmIH > .sc-bxivhb > svg',
}

// Selectors for Categories
export const CATEGORIES = {
    buttonOpslaan: '[data-testid=submitBtn]',
    dropdownTypeOfDays: '#use_calendar_days',
    inputDays: '#n_days',
    inputMessage: '#handling_message'
}