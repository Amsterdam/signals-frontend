export enum SortOptions {
  ADDRESS_ASC = 'address',
  ADDRESS_DESC = '-address',
  ASSIGNED_USER_EMAIL_ASC = 'assigned_user_email',
  ASSIGNED_USER_EMAIL_DESC = '-assigned_user_email',
  BUROUGH_ASC = 'stadsdeel',
  BUROUGH_DESC = '-stadsdeel',
  ID_ASC = 'id',
  ID_DESC = '-id',
  DISTRICT_ASC = 'area_name',
  DISTRICT_DESC = '-area_name',
  CREATED_AT_ASC = '-created_at',
  CREATED_AT_DESC = 'created_at',
  PRIORITY_ASC = 'priority',
  PRIORITY_DESC = '-priority',
  STATUS_ASC = 'status',
  STATUS_DESC = '-status',
  SUBCATEGORY_ASC = 'sub_category',
  SUBCATEGORY_DESC = '-sub_category',
}

export enum SortOptionKeys {
  ADRES = 'adres',
  DATUM = 'datum',
  ID = 'id',
  STADSDEEL = 'stadsdeel',
  STATUS = 'status',
  SUBCATEGORY = 'subcategorie',
  URGENTIE = 'urgentie',
}

export enum SortOptionLabels {
  ADRES = 'Adres',
  DATUM = 'Datum',
  ID = 'Id',
  STADSDEEL = 'Stadsdeel',
  STATUS = 'Status',
  SUBCATEGORY = 'Subcategorie',
  URGENTIE = 'Urgentie',
}

export type SortOption = {
  key: SortOptionKeys
  label: string
  asc: SortOptions
  desc: SortOptions
  asc_label: string
  desc_label: string
}

export const sortOptionsList: SortOption[] = [
  {
    key: SortOptionKeys.ADRES,
    label: SortOptionLabels.ADRES,
    asc: SortOptions.ADDRESS_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.ADDRESS_DESC,
    desc_label: '(z-a)',
  },
  {
    key: SortOptionKeys.DATUM,
    label: SortOptionLabels.DATUM,
    asc: SortOptions.CREATED_AT_ASC,
    asc_label: '(nieuw-oud)',
    desc: SortOptions.CREATED_AT_DESC,
    desc_label: '(oud-nieuw)',
  },
  {
    key: SortOptionKeys.ID,
    label: SortOptionLabels.ID,
    asc: SortOptions.ID_ASC,
    asc_label: '(laag-hoog)',
    desc: SortOptions.ID_DESC,
    desc_label: '(hoog-laag)',
  },
  {
    key: SortOptionKeys.STADSDEEL,
    label: SortOptionLabels.STADSDEEL,
    asc: SortOptions.BUROUGH_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.BUROUGH_DESC,
    desc_label: '(z-a)',
  },
  {
    key: SortOptionKeys.STATUS,
    label: SortOptionLabels.STATUS,
    asc: SortOptions.STATUS_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.STATUS_DESC,
    desc_label: '(z-a)',
  },
  {
    key: SortOptionKeys.SUBCATEGORY,
    label: SortOptionLabels.SUBCATEGORY,
    asc: SortOptions.SUBCATEGORY_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.SUBCATEGORY_DESC,
    desc_label: '(z-a)',
  },
  {
    key: SortOptionKeys.URGENTIE,
    label: SortOptionLabels.URGENTIE,
    asc: SortOptions.PRIORITY_ASC,
    asc_label: '(laag-hoog)',
    desc: SortOptions.PRIORITY_DESC,
    desc_label: '(hoog-laag)',
  },
]

export const TYPE_GLOBAL = 'global'
export const VARIANT_NOTICE = 'notice'
