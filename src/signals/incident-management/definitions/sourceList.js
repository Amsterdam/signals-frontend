// HERE BE DRAGONS!!!1!
// note that the dashes in the list below aren't '-' characters, but EN dashes
// replacing the characters will affect filtering incidents, because the API does a
// full-string match
const sourceList = [
  { key: 'Telefoon – Adoptant', value: 'Telefoon – Adoptant' },
  { key: 'Telefoon – ASC', value: 'Telefoon – ASC' },
  { key: 'Telefoon – CCA', value: 'Telefoon – CCA' },
  { key: 'Telefoon – CCTR', value: 'Telefoon – CCTR' },
  { key: 'Telefoon – Interswitch', value: 'Telefoon – Interswitch' },
  { key: 'Telefoon – Stadsdeel', value: 'Telefoon – Stadsdeel' },
  { key: 'E-mail – CCA', value: 'E-mail – CCA' },
  { key: 'E-mail – ASC', value: 'E-mail – ASC' },
  { key: 'E-mail – Stadsdeel', value: 'E-mail – Stadsdeel' },
  { key: 'Webcare – CCA', value: 'Webcare – CCA' },
  { key: 'Eigen organisatie', value: 'Eigen organisatie' },
  { key: 'Fixi Weesp', value: 'Fixi Weesp' },
  {
    key: 'Meldkamer burger/ondernemer',
    value: 'Meldkamer burger/ondernemer',
  },
  { key: 'Meldkamer Handhaver', value: 'Meldkamer Handhaver' },
  { key: 'Meldkamer Politie', value: 'Meldkamer Politie' },
  { key: 'VerbeterDeBuurt', value: 'VerbeterDeBuurt' },
  { key: 'Waarnemingenapp', value: 'Waarnemingenapp' },
];

export default sourceList;
