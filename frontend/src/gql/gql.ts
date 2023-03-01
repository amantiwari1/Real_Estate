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
    "\n  query nftModel($id: ID!) {\n    nftModel(id: $id) {\n      state\n      nfts {\n        blockchainState\n      }\n      id\n      attributes\n      status\n      blockchainId\n      metadata\n      title\n      description\n      rarity\n      quantity\n      quantityMinted\n      content {\n        id\n        poster {\n          url\n          state\n          contentType\n          id\n          md5\n        }\n        files {\n          url\n          id\n          state\n          contentType\n          md5\n        }\n      }\n      set {\n        id\n        title\n      }\n    }\n  }\n": types.NftModelDocument,
    "\n  mutation CheckoutWithDapperWallet(\n    $nftModelId: ID!\n    $address: String!\n    $price: UnsignedFloat\n    $expiry: UnsignedInt\n  ) {\n    checkoutWithDapperWallet(\n      nftModelId: $nftModelId\n      address: $address\n      price: $price\n      expiry: $expiry\n    ) {\n      cadence\n      brand\n      expiry\n      nftId\n      nftDatabaseId\n      nftTypeRef\n      price\n      registryAddress\n      setId\n      templateId\n      signerAddress\n      signerKeyId\n    }\n  }\n": types.CheckoutWithDapperWalletDocument,
    "\n  mutation registerWallet($address: String!) {\n    registerWallet(address: $address) {\n      id\n      address\n      verificationCode\n      state\n    }\n  }\n": types.RegisterWalletDocument,
    "\n  query walletByAddress($address: String!) {\n    walletByAddress(address: $address) {\n      id\n      address\n      state\n      verificationCode\n    }\n  }\n": types.WalletByAddressDocument,
    "\n  mutation verifyWallet($address: String!, $signedVerificationCode: JSON!) {\n    verifyWallet(\n      address: $address\n      signedVerificationCode: $signedVerificationCode\n    ) {\n      id\n      address\n      state\n    }\n  }\n": types.VerifyWalletDocument,
    "\n  mutation readyWallet($address: String!) {\n    readyWallet(address: $address) {\n      id\n      address\n      state\n    }\n  }\n": types.ReadyWalletDocument,
    "\n  query contract {\n    contract {\n      name\n      address\n    }\n  }\n": types.ContractDocument,
    "\n  mutation SignTransactionForDapperWallet($transaction: String) {\n    signTransactionForDapperWallet(transaction: $transaction)\n  }\n": types.SignTransactionForDapperWalletDocument,
    "\n  mutation CompleteCheckoutWithDapperWallet(\n    $transactionId: String!\n    $nftDatabaseId: String\n  ) {\n    completeCheckoutWithDapperWallet(\n      transactionId: $transactionId\n      nftDatabaseId: $nftDatabaseId\n    ) {\n      id\n      blockchainId\n      serialNumber\n      saleState\n      blockchainState\n    }\n  }\n": types.CompleteCheckoutWithDapperWalletDocument,
    "\n  mutation transferNFTToUser($nftModelId: ID!, $address: String!) {\n    transfer(nftModelId: $nftModelId, address: $address) {\n      id\n    }\n  }\n": types.TransferNftToUserDocument,
    "\n  query nftsByWallet($address: String) {\n    nftsByWallet(address: $address) {\n      items {\n        id\n        blockchainId\n        serialNumber\n        blockchainState\n        model {\n          id\n          title\n          description\n          attributes\n          rarity\n          content {\n            id\n            poster {\n              url\n              state\n              contentType\n              id\n            }\n          }\n        }\n        status\n      }\n      cursor\n    }\n  }\n": types.NftsByWalletDocument,
    "\n  query nft($id: ID!) {\n    nft(id: $id) {\n      blockchainId\n      metadata\n      id\n      serialNumber\n      model {\n        id\n        attributes\n        status\n        blockchainId\n        metadata\n        title\n        description\n        rarity\n        quantity\n        content {\n          id\n          poster {\n            url\n            state\n            contentType\n            id\n          }\n          files {\n            url\n            id\n            state\n            contentType\n          }\n        }\n      }\n      status\n    }\n  }\n": types.NftDocument,
    "\n  mutation UpdateNFTModel($data: NFTModelUpdateInput!, $updateNftModelId: ID!) {\n    updateNFTModel(data: $data, id: $updateNftModelId) {\n      id\n      description\n      title\n      metadata\n      quantity\n      attributes\n    }\n  }\n": types.UpdateNftModelDocument,
    "\n  query nftModels($appId: ID) {\n    nftModels(appId: $appId) {\n      items {\n        nfts {\n          blockchainState\n        }\n        id\n        blockchainId\n        title\n        description\n        attributes\n        quantity\n        state\n        status\n        rarity\n        content {\n          files {\n            url\n            contentType\n          }\n          poster {\n            url\n          }\n        }\n      }\n      cursor\n    }\n  }\n": types.NftModelsDocument,
    "\n  mutation mintNFTModel($appId: ID, $id: ID!, $quantity: PositiveInt) {\n    mintNFTModel(appId: $appId, id: $id, quantity: $quantity) {\n      attributes\n      blockchainId\n      createdAt\n      description\n      id\n      metadata\n      quantity\n      quantityMinted\n      rarity\n      state\n      status\n      title\n      updatedAt\n    }\n  }\n": types.MintNftModelDocument,
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
export function graphql(source: "\n  query nftModel($id: ID!) {\n    nftModel(id: $id) {\n      state\n      nfts {\n        blockchainState\n      }\n      id\n      attributes\n      status\n      blockchainId\n      metadata\n      title\n      description\n      rarity\n      quantity\n      quantityMinted\n      content {\n        id\n        poster {\n          url\n          state\n          contentType\n          id\n          md5\n        }\n        files {\n          url\n          id\n          state\n          contentType\n          md5\n        }\n      }\n      set {\n        id\n        title\n      }\n    }\n  }\n"): (typeof documents)["\n  query nftModel($id: ID!) {\n    nftModel(id: $id) {\n      state\n      nfts {\n        blockchainState\n      }\n      id\n      attributes\n      status\n      blockchainId\n      metadata\n      title\n      description\n      rarity\n      quantity\n      quantityMinted\n      content {\n        id\n        poster {\n          url\n          state\n          contentType\n          id\n          md5\n        }\n        files {\n          url\n          id\n          state\n          contentType\n          md5\n        }\n      }\n      set {\n        id\n        title\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CheckoutWithDapperWallet(\n    $nftModelId: ID!\n    $address: String!\n    $price: UnsignedFloat\n    $expiry: UnsignedInt\n  ) {\n    checkoutWithDapperWallet(\n      nftModelId: $nftModelId\n      address: $address\n      price: $price\n      expiry: $expiry\n    ) {\n      cadence\n      brand\n      expiry\n      nftId\n      nftDatabaseId\n      nftTypeRef\n      price\n      registryAddress\n      setId\n      templateId\n      signerAddress\n      signerKeyId\n    }\n  }\n"): (typeof documents)["\n  mutation CheckoutWithDapperWallet(\n    $nftModelId: ID!\n    $address: String!\n    $price: UnsignedFloat\n    $expiry: UnsignedInt\n  ) {\n    checkoutWithDapperWallet(\n      nftModelId: $nftModelId\n      address: $address\n      price: $price\n      expiry: $expiry\n    ) {\n      cadence\n      brand\n      expiry\n      nftId\n      nftDatabaseId\n      nftTypeRef\n      price\n      registryAddress\n      setId\n      templateId\n      signerAddress\n      signerKeyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation registerWallet($address: String!) {\n    registerWallet(address: $address) {\n      id\n      address\n      verificationCode\n      state\n    }\n  }\n"): (typeof documents)["\n  mutation registerWallet($address: String!) {\n    registerWallet(address: $address) {\n      id\n      address\n      verificationCode\n      state\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query walletByAddress($address: String!) {\n    walletByAddress(address: $address) {\n      id\n      address\n      state\n      verificationCode\n    }\n  }\n"): (typeof documents)["\n  query walletByAddress($address: String!) {\n    walletByAddress(address: $address) {\n      id\n      address\n      state\n      verificationCode\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation verifyWallet($address: String!, $signedVerificationCode: JSON!) {\n    verifyWallet(\n      address: $address\n      signedVerificationCode: $signedVerificationCode\n    ) {\n      id\n      address\n      state\n    }\n  }\n"): (typeof documents)["\n  mutation verifyWallet($address: String!, $signedVerificationCode: JSON!) {\n    verifyWallet(\n      address: $address\n      signedVerificationCode: $signedVerificationCode\n    ) {\n      id\n      address\n      state\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation readyWallet($address: String!) {\n    readyWallet(address: $address) {\n      id\n      address\n      state\n    }\n  }\n"): (typeof documents)["\n  mutation readyWallet($address: String!) {\n    readyWallet(address: $address) {\n      id\n      address\n      state\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query contract {\n    contract {\n      name\n      address\n    }\n  }\n"): (typeof documents)["\n  query contract {\n    contract {\n      name\n      address\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignTransactionForDapperWallet($transaction: String) {\n    signTransactionForDapperWallet(transaction: $transaction)\n  }\n"): (typeof documents)["\n  mutation SignTransactionForDapperWallet($transaction: String) {\n    signTransactionForDapperWallet(transaction: $transaction)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CompleteCheckoutWithDapperWallet(\n    $transactionId: String!\n    $nftDatabaseId: String\n  ) {\n    completeCheckoutWithDapperWallet(\n      transactionId: $transactionId\n      nftDatabaseId: $nftDatabaseId\n    ) {\n      id\n      blockchainId\n      serialNumber\n      saleState\n      blockchainState\n    }\n  }\n"): (typeof documents)["\n  mutation CompleteCheckoutWithDapperWallet(\n    $transactionId: String!\n    $nftDatabaseId: String\n  ) {\n    completeCheckoutWithDapperWallet(\n      transactionId: $transactionId\n      nftDatabaseId: $nftDatabaseId\n    ) {\n      id\n      blockchainId\n      serialNumber\n      saleState\n      blockchainState\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation transferNFTToUser($nftModelId: ID!, $address: String!) {\n    transfer(nftModelId: $nftModelId, address: $address) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation transferNFTToUser($nftModelId: ID!, $address: String!) {\n    transfer(nftModelId: $nftModelId, address: $address) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query nftsByWallet($address: String) {\n    nftsByWallet(address: $address) {\n      items {\n        id\n        blockchainId\n        serialNumber\n        blockchainState\n        model {\n          id\n          title\n          description\n          attributes\n          rarity\n          content {\n            id\n            poster {\n              url\n              state\n              contentType\n              id\n            }\n          }\n        }\n        status\n      }\n      cursor\n    }\n  }\n"): (typeof documents)["\n  query nftsByWallet($address: String) {\n    nftsByWallet(address: $address) {\n      items {\n        id\n        blockchainId\n        serialNumber\n        blockchainState\n        model {\n          id\n          title\n          description\n          attributes\n          rarity\n          content {\n            id\n            poster {\n              url\n              state\n              contentType\n              id\n            }\n          }\n        }\n        status\n      }\n      cursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query nft($id: ID!) {\n    nft(id: $id) {\n      blockchainId\n      metadata\n      id\n      serialNumber\n      model {\n        id\n        attributes\n        status\n        blockchainId\n        metadata\n        title\n        description\n        rarity\n        quantity\n        content {\n          id\n          poster {\n            url\n            state\n            contentType\n            id\n          }\n          files {\n            url\n            id\n            state\n            contentType\n          }\n        }\n      }\n      status\n    }\n  }\n"): (typeof documents)["\n  query nft($id: ID!) {\n    nft(id: $id) {\n      blockchainId\n      metadata\n      id\n      serialNumber\n      model {\n        id\n        attributes\n        status\n        blockchainId\n        metadata\n        title\n        description\n        rarity\n        quantity\n        content {\n          id\n          poster {\n            url\n            state\n            contentType\n            id\n          }\n          files {\n            url\n            id\n            state\n            contentType\n          }\n        }\n      }\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateNFTModel($data: NFTModelUpdateInput!, $updateNftModelId: ID!) {\n    updateNFTModel(data: $data, id: $updateNftModelId) {\n      id\n      description\n      title\n      metadata\n      quantity\n      attributes\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateNFTModel($data: NFTModelUpdateInput!, $updateNftModelId: ID!) {\n    updateNFTModel(data: $data, id: $updateNftModelId) {\n      id\n      description\n      title\n      metadata\n      quantity\n      attributes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query nftModels($appId: ID) {\n    nftModels(appId: $appId) {\n      items {\n        nfts {\n          blockchainState\n        }\n        id\n        blockchainId\n        title\n        description\n        attributes\n        quantity\n        state\n        status\n        rarity\n        content {\n          files {\n            url\n            contentType\n          }\n          poster {\n            url\n          }\n        }\n      }\n      cursor\n    }\n  }\n"): (typeof documents)["\n  query nftModels($appId: ID) {\n    nftModels(appId: $appId) {\n      items {\n        nfts {\n          blockchainState\n        }\n        id\n        blockchainId\n        title\n        description\n        attributes\n        quantity\n        state\n        status\n        rarity\n        content {\n          files {\n            url\n            contentType\n          }\n          poster {\n            url\n          }\n        }\n      }\n      cursor\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation mintNFTModel($appId: ID, $id: ID!, $quantity: PositiveInt) {\n    mintNFTModel(appId: $appId, id: $id, quantity: $quantity) {\n      attributes\n      blockchainId\n      createdAt\n      description\n      id\n      metadata\n      quantity\n      quantityMinted\n      rarity\n      state\n      status\n      title\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation mintNFTModel($appId: ID, $id: ID!, $quantity: PositiveInt) {\n    mintNFTModel(appId: $appId, id: $id, quantity: $quantity) {\n      attributes\n      blockchainId\n      createdAt\n      description\n      id\n      metadata\n      quantity\n      quantityMinted\n      rarity\n      state\n      status\n      title\n      updatedAt\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;