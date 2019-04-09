const GEMELD = {
  key: 'm',
  value: 'Gemeld',
  color: 'red'
};
const AFWACHTING = {
  key: 'i',
  value: 'In afwachting van behandeling',
  color: 'purple'
};
const BEHANDELING = {
  key: 'b',
  value: 'In behandeling',
  color: 'blue'
};
const AFGEHANDELD = {
  key: 'o',
  value: 'Afgehandeld',
  color: 'lightgreen'
};
const GESPLITST = {
  key: 's',
  value: 'Gesplitst',
  color: 'lightgreen'
};
const ON_HOLD = {
  key: 'h',
  value: 'On hold',
  color: 'grey'
};
const GEANNULEERD = {
  key: 'a',
  value: 'Geannuleerd',
  color: 'darkgrey'
};
const HEROPEND = {
  key: 'reopened',
  value: 'Heropend',
  color: 'orange'
};
const TE_VERZENDEN = {
  key: 'ready to send',
  value: 'Extern: te verzenden'
};
const VERZONDEN = {
  key: 'sent',
  value: 'Extern: verzonden'
};
const VERZENDEN_MISLUKT = {
  key: 'send failed',
  value: 'Extern: mislukt'
};
const VERZOEK_TOT_AFHANDELING = {
  key: 'closure requested',
  value: 'Extern: verzoek tot afhandeling'
};
const AFGEHANDELD_EXTERN = {
  key: 'done external',
  value: 'Extern: afgehandeld'
};

const statusList = [
  GEMELD,
  AFWACHTING,
  BEHANDELING,
  AFGEHANDELD,
  ON_HOLD,
  GEANNULEERD,
  GESPLITST,
  HEROPEND,
  TE_VERZENDEN,
  VERZONDEN,
  VERZENDEN_MISLUKT,
  VERZOEK_TOT_AFHANDELING,
  AFGEHANDELD_EXTERN
];

export default statusList;

export const changeStatusOptionList = [
  GEMELD,
  AFWACHTING,
  BEHANDELING,
  AFGEHANDELD,
  ON_HOLD,
  GEANNULEERD,
  HEROPEND
];
