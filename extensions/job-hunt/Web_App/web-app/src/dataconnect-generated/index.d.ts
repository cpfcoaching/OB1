import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Application_Key {
  id: UUIDString;
  __typename?: 'Application_Key';
}

export interface Company_Key {
  id: UUIDString;
  __typename?: 'Company_Key';
}

export interface Contact_Key {
  id: UUIDString;
  __typename?: 'Contact_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  email: string;
  firebaseUid: string;
  displayName?: string | null;
  photoUrl?: string | null;
}

export interface GetJobPostingDetailsData {
  jobPosting?: {
    id: UUIDString;
    title: string;
    description?: string | null;
    location?: string | null;
    salaryRange?: string | null;
    postedDate?: DateString | null;
    company: {
      name: string;
      website?: string | null;
    };
  } & JobPosting_Key;
}

export interface GetJobPostingDetailsVariables {
  jobPostingId: UUIDString;
}

export interface GetMyApplicationsData {
  applications: ({
    id: UUIDString;
    status: string;
    jobPosting: {
      title: string;
      company: {
        name: string;
      };
    };
    applicationDate: DateString;
  } & Application_Key)[];
}

export interface Interview_Key {
  id: UUIDString;
  __typename?: 'Interview_Key';
}

export interface JobPosting_Key {
  id: UUIDString;
  __typename?: 'JobPosting_Key';
}

export interface UpdateApplicationStatusData {
  application_updateMany: number;
}

export interface UpdateApplicationStatusVariables {
  applicationId: UUIDString;
  newStatus: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface GetMyApplicationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyApplicationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyApplicationsData, undefined>;
  operationName: string;
}
export const getMyApplicationsRef: GetMyApplicationsRef;

export function getMyApplications(options?: ExecuteQueryOptions): QueryPromise<GetMyApplicationsData, undefined>;
export function getMyApplications(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyApplicationsData, undefined>;

interface UpdateApplicationStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateApplicationStatusVariables): MutationRef<UpdateApplicationStatusData, UpdateApplicationStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateApplicationStatusVariables): MutationRef<UpdateApplicationStatusData, UpdateApplicationStatusVariables>;
  operationName: string;
}
export const updateApplicationStatusRef: UpdateApplicationStatusRef;

export function updateApplicationStatus(vars: UpdateApplicationStatusVariables): MutationPromise<UpdateApplicationStatusData, UpdateApplicationStatusVariables>;
export function updateApplicationStatus(dc: DataConnect, vars: UpdateApplicationStatusVariables): MutationPromise<UpdateApplicationStatusData, UpdateApplicationStatusVariables>;

interface GetJobPostingDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetJobPostingDetailsVariables): QueryRef<GetJobPostingDetailsData, GetJobPostingDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetJobPostingDetailsVariables): QueryRef<GetJobPostingDetailsData, GetJobPostingDetailsVariables>;
  operationName: string;
}
export const getJobPostingDetailsRef: GetJobPostingDetailsRef;

export function getJobPostingDetails(vars: GetJobPostingDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetJobPostingDetailsData, GetJobPostingDetailsVariables>;
export function getJobPostingDetails(dc: DataConnect, vars: GetJobPostingDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetJobPostingDetailsData, GetJobPostingDetailsVariables>;

