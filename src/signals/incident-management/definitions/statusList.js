const GEMELD = {
  key: 'm',
  value: 'Gemeld',
  color: 'red',
  email_sent_when_selected: true,
  shows_remaining_sla_days: true,
};

const AFWACHTING = {
  key: 'i',
  value: 'In afwachting van behandeling',
  color: 'purple',
  email_sent_when_selected: true,
  shows_remaining_sla_days: true,
};

const BEHANDELING = {
  key: 'b',
  value: 'In behandeling',
  color: 'blue',
  email_sent_when_selected: true,
  shows_remaining_sla_days: true,
};

const AFGEHANDELD = {
  key: 'o',
  value: 'Afgehandeld',
  warning:
    'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting. Verwijs nooit naar een andere afdeling; hercategoriseer dan de melding. Gebruik deze status alleen als de melding ook echt is afgehandeld, gebruik anders de status Ingepland. Let op: als de huidige status “Verzoek tot heropenen” is, dan wordt er geen e-mail naar de melder gestuurd.',
  color: 'lightgreen',
  email_sent_when_selected: false,
  shows_remaining_sla_days: false,
};

const GESPLITST = {
  key: 's',
  value: 'Gesplitst',
  color: 'lightgreen',
  email_sent_when_selected: false,
  shows_remaining_sla_days: false,
};

const INGEPLAND = {
  key: 'ingepland',
  value: 'Ingepland',
  warning:
    'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting.',
  color: 'grey',
  email_sent_when_selected: false,
  shows_remaining_sla_days: true,
};

const GEANNULEERD = {
  key: 'a',
  value: 'Geannuleerd',
  warning:
    'Bij deze status wordt de melding afgesloten. Gebruik deze status alleen voor test- en nepmeldingen of meldingen van veelmelders.',
  color: 'darkgrey',
  email_sent_when_selected: true,
  shows_remaining_sla_days: false,
};

const VERZOEK_TOT_HEROPENEN = {
  key: 'reopen requested',
  value: 'Verzoek tot heropenen',
  color: 'orange',
  email_sent_when_selected: false,
  shows_remaining_sla_days: false,
};

const HEROPEND = {
  key: 'reopened',
  value: 'Heropend',
  warning:
    'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting. Verwijs nooit naar een andere afdeling; hercategoriseer dan de melding.',
  color: 'orange',
  email_sent_when_selected: false,
  shows_remaining_sla_days: true,
};

const TE_VERZENDEN = {
  key: 'ready to send',
  value: 'Extern: te verzenden',
  email_sent_when_selected: false,
  shows_remaining_sla_days: true,
};

const VERZONDEN = {
  key: 'sent',
  value: 'Extern: verzonden',
  email_sent_when_selected: false,
  shows_remaining_sla_days: true,
};

const VERZENDEN_MISLUKT = {
  key: 'send failed',
  value: 'Extern: mislukt',
  email_sent_when_selected: false,
  shows_remaining_sla_days: true,
};

const VERZOEK_TOT_AFHANDELING = {
  key: 'closure requested',
  value: 'Extern: verzoek tot afhandeling',
  email_sent_when_selected: false,
  shows_remaining_sla_days: true,
};

const AFGEHANDELD_EXTERN = {
  key: 'done external',
  value: 'Extern: afgehandeld',
  email_sent_when_selected: false,
  shows_remaining_sla_days: true,
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

export const defaultTextsOptionList = [...changeStatusOptionList];
