/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as fcl from "@onflow/fcl";

// storefront initialised

async function createListing(
  collectionIdentifier: string,
  saleItemID: number,
  saleItemPrice: number,
  customID: string | undefined,
  buyer: string | undefined,
  expiry: number
) {
  const txId = await fcl.mutate({
    cadence: `
    import FiatToken from 0xa983fecbed621163
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
    
            if seller.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath) == nil {
                let v <- FiatToken.createEmptyVault()
                seller.save(<- v, to: FiatToken.VaultStoragePath)
    
                // unlink usdc paths
                seller.unlink(FiatToken.VaultBalancePubPath)
                seller.unlink(FiatToken.VaultReceiverPubPath)
    
                // link usdc paths
                seller.link<&FiatToken.Vault{FungibleToken.Balance}>(FiatToken.VaultBalancePubPath, target: FiatToken.VaultStoragePath)
                seller.link<&FiatToken.Vault{FungibleToken.Receiver}>(FiatToken.VaultReceiverPubPath, target: FiatToken.VaultStoragePath)
            }
    
            // Receiver for the sale cut.
            self.paymentReceiver = seller.getCapability<&{FungibleToken.Receiver}>(FiatToken.VaultReceiverPubPath)
            assert(self.paymentReceiver.borrow() != nil, message: "Missing or mis-typed FiatToken receiver")
    
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
                salePaymentVaultType: Type<@FiatToken.Vault>(),
                price: saleItemPrice,
                customID: customID,
                expiry: UInt64(getCurrentBlock().timestamp) + expiry,
                buyer: buyer
            )
        }
    }
    `,
    args: (arg: any, t: any) => [
      arg(collectionIdentifier, t.String),
      arg(saleItemID, t.UInt64),
      arg(saleItemPrice, t.UFix64),
      arg(customID, t.Optional(t.String)),
      arg(buyer, t.Optional(t.Address)),
      arg(expiry, t.UInt64),
    ],
    // proposer : fcl.proposer,
    // payer: fcl.currentUser,
    limit: 999,
  });

  const txn = await fcl.tx(txId).onceSealed();
  console.log(txn);
}

export default createListing;
