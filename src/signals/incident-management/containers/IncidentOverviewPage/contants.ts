import configuration from 'shared/services/configuration/configuration'

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
  CREATED_AT_ASC = 'created_at',
  CREATED_AT_DESC = '-created_at',
  PRIORITY_ASC = 'priority',
  PRIORITY_DESC = '-priority',
  STATUS_ASC = 'status',
  STATUS_DESC = '-status',
  SUBCATEGORY_ASC = 'sub_category',
  SUBCATEGORY_DESC = '-sub_category',
}

export enum SortOptionKeys {
  ADDRESS = 'adres',
  DATE = 'datum',
  ID = 'id',
  BUROUGH = 'stadsdeel',
  DISTRICT = 'area_name',
  STATUS = 'status',
  SUBCATEGORY = 'subcategorie',
  PRIORITY = 'urgentie',
  ASSIGNED_USER_EMAIL = 'toegewezen_aan',
}

export enum SortOptionLabels {
  ADDRESS = 'Adres',
  DISTRICT = `Wijk`,
  DATE = 'Datum',
  ID = 'Id',
  BUROUGH = 'Stadsdeel',
  STATUS = 'Status',
  SUBCATEGORY = 'Subcategorie',
  PRIORITY = 'Urgentie',
  ASSIGNED_USER_EMAIL = 'Toegewezen aan',
}

export type SortOption = {
  label: string
  asc: SortOptions
  desc: SortOptions
  asc_label: string
  desc_label: string
}

export const sortOptionsList: SortOption[] = [
  {
    label: SortOptionLabels.ASSIGNED_USER_EMAIL,
    asc: SortOptions.ASSIGNED_USER_EMAIL_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.ASSIGNED_USER_EMAIL_DESC,
    desc_label: '(z-a)',
  },
  {
    label: SortOptionLabels.ADDRESS,
    asc: SortOptions.ADDRESS_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.ADDRESS_DESC,
    desc_label: '(z-a)',
  },
  {
    label: SortOptionLabels.DATE,
    asc: SortOptions.CREATED_AT_ASC,
    asc_label: '(oud-nieuw)',
    desc: SortOptions.CREATED_AT_DESC,
    desc_label: '(nieuw-oud)',
  },
  {
    label: SortOptionLabels.ID,
    asc: SortOptions.ID_ASC,
    asc_label: '(laag-hoog)',
    desc: SortOptions.ID_DESC,
    desc_label: '(hoog-laag)',
  },
  {
    label: SortOptionLabels.BUROUGH,
    asc: SortOptions.BUROUGH_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.BUROUGH_DESC,
    desc_label: '(z-a)',
  },
  {
    label: configuration.language.district ?? SortOptionLabels.DISTRICT,
    asc: SortOptions.DISTRICT_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.DISTRICT_DESC,
    desc_label: '(z-a)',
  },
  {
    label: SortOptionLabels.STATUS,
    asc: SortOptions.STATUS_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.STATUS_DESC,
    desc_label: '(z-a)',
  },
  {
    label: SortOptionLabels.SUBCATEGORY,
    asc: SortOptions.SUBCATEGORY_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.SUBCATEGORY_DESC,
    desc_label: '(z-a)',
  },
  {
    label: SortOptionLabels.PRIORITY,
    asc: SortOptions.PRIORITY_ASC,
    asc_label: '(hoog-laag-normaal)',
    desc: SortOptions.PRIORITY_DESC,
    desc_label: '(normaal-laag-hoog)',
  },
]
