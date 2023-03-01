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
      state
      nfts {
        blockchainState
      }
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

const SignTransactionForDapperWallet = graphql(/* GraphQL */ `
  mutation SignTransactionForDapperWallet($transaction: String) {
    signTransactionForDapperWallet(transaction: $transaction)
  }
`);

const CompleteCheckoutWithDapperWallet = graphql(/* GraphQL */ `
  mutation CompleteCheckoutWithDapperWallet(
    $transactionId: String!
    $nftDatabaseId: String
  ) {
    completeCheckoutWithDapperWallet(
      transactionId: $transactionId
      nftDatabaseId: $nftDatabaseId
    ) {
      id
      blockchainId
      serialNumber
      saleState
      blockchainState
    }
  }
`);

const TransferNftToWalletDocument = graphql(/* GraphQL */ `
  mutation transferNFTToUser($nftModelId: ID!, $address: String!) {
    transfer(nftModelId: $nftModelId, address: $address) {
      id
    }
  }
`);

const nftsByWalletDocument = graphql(/* GraphQL */ `
  query nftsByWallet($address: String) {
    nftsByWallet(address: $address) {
      items {
        id
        blockchainId
        serialNumber
        blockchainState
        model {
          id
          title
          description
          attributes
          rarity
          content {
            id
            poster {
              url
              state
              contentType
              id
            }
          }
        }
        status
      }
      cursor
    }
  }
`);

const nftDocument = graphql(/* GraphQL */ `
  query nft($id: ID!) {
    nft(id: $id) {
      blockchainId
      metadata
      id
      serialNumber
      model {
        id
        attributes
        status
        blockchainId
        metadata
        title
        description
        rarity
        quantity
        content {
          id
          poster {
            url
            state
            contentType
            id
          }
          files {
            url
            id
            state
            contentType
          }
        }
      }
      status
    }
  }
`);

const UpdateNFTModelDocument = graphql(/* GraphQL */ `
  mutation UpdateNFTModel($data: NFTModelUpdateInput!, $updateNftModelId: ID!) {
    updateNFTModel(data: $data, id: $updateNftModelId) {
      id
      description
      title
      metadata
      quantity
      attributes
    }
  }
`);

const nftModelsDocument = graphql(/* GraphQL */ `
  query nftModels($appId: ID) {
    nftModels(appId: $appId) {
      items {
        nfts {
          blockchainState
        }
        id
        blockchainId
        title
        description
        attributes
        quantity
        state
        status
        rarity
        content {
          files {
            url
            contentType
          }
          poster {
            url
          }
        }
      }
      cursor
    }
  }
`);

const mintNFTModel = graphql(/* GraphQL */ `
  mutation mintNFTModel($appId: ID, $id: ID!, $quantity: PositiveInt) {
    mintNFTModel(appId: $appId, id: $id, quantity: $quantity) {
      attributes
      blockchainId
      createdAt
      description
      id
      metadata
      quantity
      quantityMinted
      rarity
      state
      status
      title
      updatedAt
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
  SignTransactionForDapperWallet,
  CompleteCheckoutWithDapperWallet,
  TransferNftToWalletDocument,
  nftsByWalletDocument,
  nftDocument,
  UpdateNFTModelDocument,
  nftModelsDocument,
  mintNFTModel,
};
