export interface User {
  _links: Links;
  _display: string;
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  roles: Role[];
  permissions: Role[];
  profile: Profile;
}

export interface Links {
  self: Self;
}

export interface Self {
  href: string;
}

export interface Role {
  _links: Links;
  _display: string;
  id: number;
  name: string;
  codename?: string;
  permissions?: Role[];
}

export interface Profile {
  note: string;
  departments: string[];
  created_at: string;
  updated_at: string;
}


export interface GlobalNotification {
  title?: string;
  message?: string;
  variant?: string;
  type?: string;
}

export interface UserCredentials {
  userName: string;
  userScopes: string[];
  accessToken: string;
}

export interface Source {
  id: number;
  name: string;
  description?: string;
}

export interface KeyValuePair<Value> {
  key: string;
  value: Value;
}

export interface Upload {
  progress?: number;
}

export interface AppState {
  readonly loading: boolean;
  readonly error: boolean;
  readonly upload: Upload;
  readonly user: Partial<User>;
  readonly notification: GlobalNotification;
  readonly searchQuery: string;
  readonly sources: Source[];
}

export interface Action<ActionType> {
  type: string;
  payload?: ActionType;
}

export declare function action<P>(type: string, payload: P): Action<P>;


export interface DataResult<ResultType> {
  results: ResultType[];
}

export interface ApiError extends Error {
  response: Partial<Response>;
}

export interface UploadFile {
  id?: number;
  file?: { name: string };
}
