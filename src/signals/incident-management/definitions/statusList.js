const GEMELD = {
  key: 'm',
  value: 'Gemeld',
  color: 'red',
  can_send_email: true,
};

const AFWACHTING = {
  key: 'i',
  value: 'In afwachting van behandeling',
  color: 'purple',
  can_send_email: true,
};

const BEHANDELING = {
  key: 'b',
  value: 'In behandeling',
  color: 'blue',
  can_send_email: true,
};

const AFGEHANDELD = {
  key: 'o',
  value: 'Afgehandeld',
  warning:
    'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting. Verwijs nooit naar een andere afdeling; hercategoriseer dan de melding. Gebruik deze status alleen als de melding ook echt is afgehandeld, gebruik anders de status Ingepland. Let op: als de huidige status “Verzoek tot heropenen” is, dan wordt er geen e-mail naar de melder gestuurd.',
  color: 'lightgreen',
  can_send_email: false,
};

const GESPLITST = {
  key: 's',
  value: 'Gesplitst',
  color: 'lightgreen',
  can_send_email: false,
};

const INGEPLAND = {
  key: 'ingepland',
  value: 'Ingepland',
  warning:
    'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting.',
  color: 'grey',
  can_send_email: false,
};

const GEANNULEERD = {
  key: 'a',
  value: 'Geannuleerd',
  warning:
    'Bij deze status wordt de melding afgesloten. Gebruik deze status alleen voor test- en nepmeldingen of meldingen van veelmelders.',
  color: 'darkgrey',
  can_send_email: true,
};

const VERZOEK_TOT_HEROPENEN = {
  key: 'reopen requested',
  value: 'Verzoek tot heropenen',
  color: 'orange',
  can_send_email: false,
};

const HEROPEND = {
  key: 'reopened',
  value: 'Heropend',
  warning:
    'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting. Verwijs nooit naar een andere afdeling; hercategoriseer dan de melding.',
  color: 'orange',
  can_send_email: false,
};

const TE_VERZENDEN = {
  key: 'ready to send',
  value: 'Extern: te verzenden',
  can_send_email: false,
};

const VERZONDEN = {
  key: 'sent',
  value: 'Extern: verzonden',
  can_send_email: false,
};

const VERZENDEN_MISLUKT = {
  key: 'send failed',
  value: 'Extern: mislukt',
  can_send_email: false,
};

const VERZOEK_TOT_AFHANDELING = {
  key: 'closure requested',
  value: 'Extern: verzoek tot afhandeling',
  can_send_email: false,
};

const AFGEHANDELD_EXTERN = {
  key: 'done external',
  value: 'Extern: afgehandeld',
  can_send_email: false,
};

const statusList = [
  GEMELD,
  AFWACHTING,
  BEHANDELING,
  AFGEHANDELD,
  INGEPLAND,
  GEANNULEERD,
  GESPLITST,
  VERZOEK_TOT_HEROPENEN,
  HEROPEND,
  TE_VERZENDEN,
  VERZONDEN,
  VERZENDEN_MISLUKT,
  VERZOEK_TOT_AFHANDELING,
  AFGEHANDELD_EXTERN,
];

export default statusList;

export const changeStatusOptionList = [
  GEMELD,
  AFWACHTING,
  INGEPLAND,
  BEHANDELING,
  VERZOEK_TOT_AFHANDELING,
  AFGEHANDELD,
  HEROPEND,
  GEANNULEERD,
];

export const defaultTextsOptionList = [AFGEHANDELD, INGEPLAND, HEROPEND];
