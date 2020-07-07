export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  /** The ID of the object */
  department?: Maybe<DepartmentType>;
  departments?: Maybe<DepartmentTypeConnection>;
  /** The ID of the object */
  category?: Maybe<CategoryType>;
  categories?: Maybe<CategoryTypeConnection>;
};


export type QueryDepartmentArgs = {
  id: Scalars['ID'];
};


export type QueryDepartmentsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  isIntern?: Maybe<Scalars['Boolean']>;
  orderBy?: Maybe<Scalars['String']>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID'];
};


export type QueryCategoriesArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Scalars['String']>;
};

/** Representation of a Department */
export type DepartmentType = Node & {
  __typename?: 'DepartmentType';
  code: Scalars['String'];
  name: Scalars['String'];
  isIntern: Scalars['Boolean'];
  /** The ID of the object. */
  id: Scalars['ID'];
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

export type DepartmentTypeConnection = {
  __typename?: 'DepartmentTypeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<DepartmentTypeEdge>>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
};

/** A Relay edge containing a `DepartmentType` and its cursor. */
export type DepartmentTypeEdge = {
  __typename?: 'DepartmentTypeEdge';
  /** The item at the end of the edge */
  node?: Maybe<DepartmentType>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** Representation of a Category */
export type CategoryType = Node & {
  __typename?: 'CategoryType';
  parent?: Maybe<CategoryType>;
  slug: Scalars['String'];
  name: Scalars['String'];
  handlingMessage?: Maybe<Scalars['String']>;
  departments?: Maybe<DepartmentTypeConnection>;
  isActive: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  slo: ServiceLevelObjectiveTypeConnection;
  statusMessageTemplates: StatusMessageTemplateTypeConnection;
  /** The ID of the object. */
  id: Scalars['ID'];
};


/** Representation of a Category */
export type CategoryTypeDepartmentsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  isIntern?: Maybe<Scalars['Boolean']>;
  orderBy?: Maybe<Scalars['String']>;
};


/** Representation of a Category */
export type CategoryTypeSloArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Scalars['String']>;
};


/** Representation of a Category */
export type CategoryTypeStatusMessageTemplatesArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  state?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Scalars['String']>;
};

export type ServiceLevelObjectiveTypeConnection = {
  __typename?: 'ServiceLevelObjectiveTypeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ServiceLevelObjectiveTypeEdge>>;
};

/** A Relay edge containing a `ServiceLevelObjectiveType` and its cursor. */
export type ServiceLevelObjectiveTypeEdge = {
  __typename?: 'ServiceLevelObjectiveTypeEdge';
  /** The item at the end of the edge */
  node?: Maybe<ServiceLevelObjectiveType>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** Representation of a ServiceLevelObjective */
export type ServiceLevelObjectiveType = Node & {
  __typename?: 'ServiceLevelObjectiveType';
  nDays: Scalars['Int'];
  useCalendarDays: ServiceLevelObjectiveUseCalendarDays;
  createdAt?: Maybe<Scalars['DateTime']>;
  /** The ID of the object. */
  id: Scalars['ID'];
};

/** An enumeration. */
export enum ServiceLevelObjectiveUseCalendarDays {
  /** Kalender dagen */
  True = 'TRUE',
  /** Werk dagen */
  False = 'FALSE'
}


export type StatusMessageTemplateTypeConnection = {
  __typename?: 'StatusMessageTemplateTypeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<StatusMessageTemplateTypeEdge>>;
};

/** A Relay edge containing a `StatusMessageTemplateType` and its cursor. */
export type StatusMessageTemplateTypeEdge = {
  __typename?: 'StatusMessageTemplateTypeEdge';
  /** The item at the end of the edge */
  node?: Maybe<StatusMessageTemplateType>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** Representation of a StatusMessageTemplate */
export type StatusMessageTemplateType = Node & {
  __typename?: 'StatusMessageTemplateType';
  state: StatusMessageTemplateState;
  title?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
};

/** An enumeration. */
export enum StatusMessageTemplateState {
  /** Gemeld */
  M = 'M',
  /** In afwachting van behandeling */
  I = 'I',
  /** In behandeling */
  B = 'B',
  /** On hold */
  H = 'H',
  /** Ingepland */
  Ingepland = 'INGEPLAND',
  /** Te verzenden naar extern systeem */
  ReadyToSend = 'READY_TO_SEND',
  /** Afgehandeld */
  O = 'O',
  /** Geannuleerd */
  A = 'A',
  /** Heropend */
  Reopened = 'REOPENED',
  /** Gesplitst */
  S = 'S',
  /** Verzoek tot afhandeling */
  ClosureRequested = 'CLOSURE_REQUESTED',
  /** Verzonden naar extern systeem */
  Sent = 'SENT',
  /** Verzending naar extern systeem mislukt */
  SendFailed = 'SEND_FAILED',
  /** Melding is afgehandeld in extern systeem */
  DoneExternal = 'DONE_EXTERNAL',
  /** Verzoek tot heropenen */
  ReopenRequested = 'REOPEN_REQUESTED'
}

export type CategoryTypeConnection = {
  __typename?: 'CategoryTypeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CategoryTypeEdge>>;
};

/** A Relay edge containing a `CategoryType` and its cursor. */
export type CategoryTypeEdge = {
  __typename?: 'CategoryTypeEdge';
  /** The item at the end of the edge */
  node?: Maybe<CategoryType>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};
