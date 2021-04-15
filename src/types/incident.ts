// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
export interface Incident {
  priority: Priority;
  classification: Classification;
  incident_time_hours: number;
  // questions: any[];
  handling_message: string;
  // images_previews: any[];
  location: Location;
  // images: any[];
  type: Priority;
  incident_time_minutes: number;
  incident_date: string;
  datetime: Datetime;
  email: string;
  description: string;
  category: string;
  subcategory: string;
}

export interface Classification {
  id: string;
  name: string;
  slug: string;
}

export interface Datetime {
  id: string;
  label: string;
  info: string;
}

export interface Location extends Record<string, any> {
  geometrie: Geometrie;
  address: Address;
}

export interface Address extends Record<string, any> {
  openbare_ruimte: string;
  huisnummer: string | number;
  postcode: string;
  woonplaats: string;
}

export interface Geometrie {
  type: string;
  coordinates: number[];
}

export interface Priority {
  id: string;
  label: string;
}
