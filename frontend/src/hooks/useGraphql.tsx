import request from "graphql-request";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const URL =
  process.env.NEXT_PUBLIC_API_PATH ?? "https://graphql.api.staging.niftory.com";

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): UseQueryResult<TResult> {
  return useQuery(
    [(document.definitions[0] as any).name.value, variables],
    async ({ queryKey }) =>
      request(URL, document, queryKey[1] ? queryKey[1] : undefined, {
        "X-Niftory-API-Key": "o4hB8pOhgvYXOwCEEcaf6IJBjaObAc0GPZARd4tHvVo=",
      })
  );
}
