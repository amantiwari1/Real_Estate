/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "graphql-request";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  useMutation,
  useQuery,
  type UseQueryOptions,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

const URL =
  process.env.NEXT_PUBLIC_API_PATH ?? "https://graphql.api.staging.niftory.com";

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  options?: UseQueryOptions<TResult, unknown, TResult, any[]>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): UseQueryResult<TResult> {
  return useQuery(
    [(document.definitions[0] as any).name.value, variables],
    async ({ queryKey }) =>
      request(URL, document, queryKey[1] ? queryKey[1] : undefined, {
        "X-Niftory-API-Key": "o4hB8pOhgvYXOwCEEcaf6IJBjaObAc0GPZARd4tHvVo=",
      }),
    options ?? {}
  );
}

export function useGraphQLMutation<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>
): UseMutationResult<TResult, unknown, TVariables> {
  return useMutation(
    async (data) =>
      await request<TResult, any>(URL, document, data, {
        "X-Niftory-API-Key": "o4hB8pOhgvYXOwCEEcaf6IJBjaObAc0GPZARd4tHvVo=",
      })
  );
}
