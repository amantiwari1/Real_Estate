/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as fcl from "@onflow/fcl";

fcl.authenticate();

async function createListing(collectionIdentifier: string, saleItemID: number, saleItemPrice: number, customID: string | undefined, buyer: string | undefined, expiry: number) {

  const txId = await fcl.mutate({
    cadence: `
      import DapperUtilityCoin from 0x82ec283f88a62e65
      import FungibleToken from 0x9a0766d93b6608b7
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import MetadataViews from 0x631e88ae7f1d7c20
      import NFTCatalog from 0x324c34e1c517e4db
      import NFTStorefrontV2 from 0xb051bdaddb672a33
      import TokenForwarding from 0x51ea0e37c27a1f1a

      transaction(collectionIdentifier: String, saleItemID: UInt64, saleItemPrice: UFix64, customID: String?, buyer: Address?, expiry: UInt64) {
          let paymentReceiver: Capability<&AnyResource{FungibleToken.Receiver}>
          let collectionCap: Capability<&AnyResource{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
          let storefront: &NFTStorefrontV2.Storefront
          let nftType: Type

          prepare(seller: AuthAccount) {
              if seller.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {
                  // Create a new empty Storefront
                  let storefront <- NFTStorefrontV2.createStorefront() as! @NFTStorefrontV2.Storefront
                  // save it to the account
                  seller.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)
                  // create a public capability for the Storefront, first unlinking to ensure we remove anything that''s already present
                  seller.unlink(NFTStorefrontV2.StorefrontPublicPath)
                  seller.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)
              }

              let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) ?? panic("Provided collection is not in the NFT Catalog.")

              // We need a provider capability, but one is not provided by default so we create one if needed.
              let nftCollectionProviderPrivatePath = PrivatePath(identifier: collectionIdentifier.concat("CollectionProviderForFlowtyNFTStorefront"))!

              // Receiver for the sale cut.
              self.paymentReceiver = seller.getCapability<&{FungibleToken.Receiver}>(/public/dapperUtilityCoinReceiver)
              assert(self.paymentReceiver.borrow() != nil, message: "Missing or mis-typed DapperUtilityCoin receiver")

              self.collectionCap = seller.getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftCollectionProviderPrivatePath)
              if !self.collectionCap.check() {
                  seller.unlink(nftCollectionProviderPrivatePath)
                  seller.link<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftCollectionProviderPrivatePath, target: value.collectionData.storagePath)
              }

              let collection = self.collectionCap.borrow()
                  ?? panic("Could not borrow a reference to the collection")
              assert(self.collectionCap.borrow() != nil, message: "Missing or mis-typed NonFungibleToken.Provider, NonFungibleToken.CollectionPublic provider")
              let nft = collection.borrowNFT(id: saleItemID)
              self.nftType = nft.getType()

              self.storefront = seller.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath)
                  ?? panic("Missing or mis-typed NFTStorefront Storefront")
          }

          execute {
              // check for existing listings of the NFT
              var existingListingIDs = self.storefront.getExistingListingIDs(
                  nftType: self.nftType,
                  nftID: saleItemID
              )
              // remove existing listings
              for listingID in existingListingIDs {
                  self.storefront.removeListing(listingResourceID: listingID)
              }

              // Create listing
              self.storefront.createListing(
                  nftProviderCapability: self.collectionCap,
                  paymentReceiver: self.paymentReceiver,
                  nftType: self.nftType,
                  nftID: saleItemID,
                  salePaymentVaultType: Type<@DapperUtilityCoin.Vault>(),
                  price: saleItemPrice,
                  customID: customID,
                  expiry: UInt64(getCurrentBlock().timestamp) + expiry,
                  buyer: buyer
              )
          }
      }
    `,
    args: (arg: (arg0: string | number | undefined, arg1: any) => any , t: { String: any; UInt64: any; UFix64: any; Address: any; }) => [
      arg(collectionIdentifier, t.String),
      arg(saleItemID, t.UInt64),
      arg(saleItemPrice, t.UFix64),
      arg(customID, t.String),
      arg(buyer, t.Address),
      arg(expiry, t.UInt64),
    ],
  });



}

export default createListing;