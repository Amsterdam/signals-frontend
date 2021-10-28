// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
declare namespace signal {

  export interface Category {
    sub: string;
    sub_slug: string;
    main: string;
    main_slug: string;
    category_url: string;
    departments: string;
    created_by?: string;
    text?: string;
    handling_time: string;
  }

  export interface Geometrie {
    type: string;
    coordinates: [number, number];
  }

  export interface Address {
    stadsdeel: string;
    postcode: string;
    huisletter: string;
    huisnummer: number;
    woonplaats: string;
    openbare_ruimte: string;
    huisnummer_toevoeging: string;
    address_text: string;
    geometrie: Geometrie;
  }

  export interface Status {
    text: string;
    user: string;
    state: string;
    state_display: string;
    send_email: boolean;
    created_at: string;
  }

  export interface Reporter {
    email: string;
    phone: string;
    sharing_allowed: string;
  }

  export interface Note {
    text: string;
    created_by?: string;
  }
  export interface ExtraProperties {
    shortLabel: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answer: any;
  }

  export interface DirectingDepartment {
    id: number;
    code: string;
    name: string;
    is_intern: boolean;
  }

  export interface Fixtures {
    address: string;
    attachments?: string[];
    prediction: string;
  }

  export interface RootObject {
    category: Category;
    id?: string;
    has_attachments: boolean;
    address: Address;
    status: Status;
    reporter: Reporter;
    priority: string;
    process_time: string;
    notes: Note[];
    type: string;
    source: string;
    text: string;
    text_extra: string;
    extra_properties: ExtraProperties[];
    created_at: string;
    updated_at: string;
    incident_date_start: string;
    incident_date_end?: string;
    time: string;
    directing_departments: DirectingDepartment[];
    fixtures: Fixtures;
  }

}
