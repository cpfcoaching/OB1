import { CreateUserData, CreateUserVariables, GetMyApplicationsData, UpdateApplicationStatusData, UpdateApplicationStatusVariables, GetJobPostingDetailsData, GetJobPostingDetailsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useGetMyApplications(options?: useDataConnectQueryOptions<GetMyApplicationsData>): UseDataConnectQueryResult<GetMyApplicationsData, undefined>;
export function useGetMyApplications(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyApplicationsData>): UseDataConnectQueryResult<GetMyApplicationsData, undefined>;

export function useUpdateApplicationStatus(options?: useDataConnectMutationOptions<UpdateApplicationStatusData, FirebaseError, UpdateApplicationStatusVariables>): UseDataConnectMutationResult<UpdateApplicationStatusData, UpdateApplicationStatusVariables>;
export function useUpdateApplicationStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateApplicationStatusData, FirebaseError, UpdateApplicationStatusVariables>): UseDataConnectMutationResult<UpdateApplicationStatusData, UpdateApplicationStatusVariables>;

export function useGetJobPostingDetails(vars: GetJobPostingDetailsVariables, options?: useDataConnectQueryOptions<GetJobPostingDetailsData>): UseDataConnectQueryResult<GetJobPostingDetailsData, GetJobPostingDetailsVariables>;
export function useGetJobPostingDetails(dc: DataConnect, vars: GetJobPostingDetailsVariables, options?: useDataConnectQueryOptions<GetJobPostingDetailsData>): UseDataConnectQueryResult<GetJobPostingDetailsData, GetJobPostingDetailsVariables>;
