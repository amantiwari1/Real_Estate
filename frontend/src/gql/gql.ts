/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation UploadNFTContent(\n    $description: String\n    $contentType: String\n    $posterContentType: String\n    $name: String\n  ) {\n    uploadNFTContent(\n      description: $description\n      contentType: $contentType\n      posterContentType: $posterContentType\n      name: $name\n    ) {\n      id\n      files {\n        id\n        url\n        state\n        md5\n        contentType\n      }\n      poster {\n        id\n        url\n        state\n        contentType\n        md5\n      }\n    }\n  }\n": types.UploadNftContentDocument,
    "\n  mutation createNFTModel($setId: ID!, $data: NFTModelCreateInput!) {\n    createNFTModel(setId: $setId, data: $data) {\n      id\n      quantity\n      title\n      status\n      attributes\n      metadata\n      description\n      content {\n        id\n        files {\n          id\n          url\n        }\n        poster {\n          url\n          id\n        }\n      }\n    }\n  }\n": types.CreateNftModelDocument,
    "\n  query nftModels($appId: ID) {\n    nftModels(appId: $appId) {\n      items {\n        id\n        blockchainId\n        title\n        description\n        quantity\n        status\n        rarity\n        content {\n          files {\n            url\n            contentType\n          }\n          poster {\n            url\n          }\n        }\n      }\n      cursor\n    }\n  }\n": types.NftModelsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UploadNFTContent(\n    $description: String\n    $contentType: String\n    $posterContentType: String\n    $name: String\n  ) {\n    uploadNFTContent(\n      description: $description\n      contentType: $contentType\n      posterContentType: $posterContentType\n      name: $name\n    ) {\n      id\n      files {\n        id\n        url\n        state\n        md5\n        contentType\n      }\n      poster {\n        id\n        url\n        state\n        contentType\n        md5\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UploadNFTContent(\n    $description: String\n    $contentType: String\n    $posterContentType: String\n    $name: String\n  ) {\n    uploadNFTContent(\n      description: $description\n      contentType: $contentType\n      posterContentType: $posterContentType\n      name: $name\n    ) {\n      id\n      files {\n        id\n        url\n        state\n        md5\n        contentType\n      }\n      poster {\n        id\n        url\n        state\n        contentType\n        md5\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createNFTModel($setId: ID!, $data: NFTModelCreateInput!) {\n    createNFTModel(setId: $setId, data: $data) {\n      id\n      quantity\n      title\n      status\n      attributes\n      metadata\n      description\n      content {\n        id\n        files {\n          id\n          url\n        }\n        poster {\n          url\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createNFTModel($setId: ID!, $data: NFTModelCreateInput!) {\n    createNFTModel(setId: $setId, data: $data) {\n      id\n      quantity\n      title\n      status\n      attributes\n      metadata\n      description\n      content {\n        id\n        files {\n          id\n          url\n        }\n        poster {\n          url\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query nftModels($appId: ID) {\n    nftModels(appId: $appId) {\n      items {\n        id\n        blockchainId\n        title\n        description\n        quantity\n        status\n        rarity\n        content {\n          files {\n            url\n            contentType\n          }\n          poster {\n            url\n          }\n        }\n      }\n      cursor\n    }\n  }\n"): (typeof documents)["\n  query nftModels($appId: ID) {\n    nftModels(appId: $appId) {\n      items {\n        id\n        blockchainId\n        title\n        description\n        quantity\n        status\n        rarity\n        content {\n          files {\n            url\n            contentType\n          }\n          poster {\n            url\n          }\n        }\n      }\n      cursor\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;