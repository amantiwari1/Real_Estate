import { graphql } from "~/gql";

const UploadNFTContentDocument = graphql(/* GraphQL */ `
  mutation UploadNFTContent(
    $description: String
    $contentType: String
    $posterContentType: String
    $name: String
  ) {
    uploadNFTContent(
      description: $description
      contentType: $contentType
      posterContentType: $posterContentType
      name: $name
    ) {
      id
      files {
        id
        url
        state
        md5
        contentType
      }
      poster {
        id
        url
        state
        contentType
        md5
      }
    }
  }
`);

const createNftModelsDocument = graphql(/* GraphQL */ `
  mutation createNFTModel($setId: ID!, $data: NFTModelCreateInput!) {
    createNFTModel(setId: $setId, data: $data) {
      id
      quantity
      title
      status
      attributes
      metadata
      description
      content {
        id
        files {
          id
          url
        }
        poster {
          url
          id
        }
      }
    }
  }
`);
const NftModelDocument = graphql(/* GraphQL */ `
  query nftModel($id: ID!) {
    nftModel(id: $id) {
      id
      attributes
      status
      blockchainId
      metadata
      title
      description
      rarity
      quantity
      quantityMinted
      content {
        id
        poster {
          url
          state
          contentType
          id
          md5
        }
        files {
          url
          id
          state
          contentType
          md5
        }
      }
      set {
        id
        title
      }
    }
  }
`);

const CheckoutWithDapperWalletDocument = graphql(/* GraphQL */ `
  mutation CheckoutWithDapperWallet(
    $nftModelId: ID!
    $address: String!
    $price: UnsignedFloat
    $expiry: UnsignedInt
  ) {
    checkoutWithDapperWallet(
      nftModelId: $nftModelId
      address: $address
      price: $price
      expiry: $expiry
    ) {
      cadence
      brand
      expiry
      nftId
      nftDatabaseId
      nftTypeRef
      price
      registryAddress
      setId
      templateId
      signerAddress
      signerKeyId
    }
  }
`);

const registerWalletDocument = graphql(/* GraphQL */ `
  mutation registerWallet($address: String!) {
    registerWallet(address: $address) {
      id
      address
      verificationCode
      state
    }
  }
`);

const getWalletDocument = graphql(/* GraphQL */ `
  query walletByAddress($address: String!) {
    walletByAddress(address: $address) {
      id
      address
      state
      verificationCode
    }
  }
`);

const verifyWalletDocument = graphql(/* GraphQL */ `
  mutation verifyWallet($address: String!, $signedVerificationCode: JSON!) {
    verifyWallet(
      address: $address
      signedVerificationCode: $signedVerificationCode
    ) {
      id
      address
      state
    }
  }
`);

const readyWalletDocument = graphql(/* GraphQL */ `
  mutation readyWallet($address: String!) {
    readyWallet(address: $address) {
      id
      address
      state
    }
  }
`);

const contractDocument = graphql(/* GraphQL */ `
  query contract {
    contract {
      name
      address
    }
  }
`);

export {
  UploadNFTContentDocument,
  createNftModelsDocument,
  NftModelDocument,
  CheckoutWithDapperWalletDocument,
  registerWalletDocument,
  getWalletDocument,
  verifyWalletDocument,
  readyWalletDocument,
  contractDocument,
};
