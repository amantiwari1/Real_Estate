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

export { UploadNFTContentDocument, createNftModelsDocument };
