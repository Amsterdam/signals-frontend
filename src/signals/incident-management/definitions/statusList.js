const ALL = { key: '', value: 'Alle statussen' };
const GEMELD = { key: 'm', value: 'Gemeld' };
const AFWACHTING = { key: 'i', value: 'In afwachting van behandeling' };
const BEHANDELING = { key: 'b', value: 'In behandeling' };
const AFGEHANDELD = { key: 'o', value: 'Afgehandeld' };
const ON_HOLD = { key: 'h', value: 'On hold' };
const GEANNULEERD = { key: 'a', value: 'Geannuleerd' };
const TE_VERZENDEN = { key: 'ready to send', value: 'Extern: te verzenden' };
const VERZONDEN = { key: 'sent', value: 'Extern: verzonden' };
const VERZENDEN_MISLUKT = { key: 'send failed', value: 'Extern: mislukt' };
const AFGEHANDELD_EXTERN = { key: 'done external', value: 'Extern: afgehandeld' };

const statusList = [
  ALL,
  GEMELD,
  AFWACHTING,
  BEHANDELING,
  AFGEHANDELD,
  ON_HOLD,
  GEANNULEERD,
  TE_VERZENDEN,
  VERZONDEN,
  VERZENDEN_MISLUKT,
  AFGEHANDELD_EXTERN
];

export default statusList;

export const changeStatusOptionList = [
  ALL,
  GEMELD,
  AFWACHTING,
  BEHANDELING,
  AFGEHANDELD,
  ON_HOLD,
  GEANNULEERD
];
