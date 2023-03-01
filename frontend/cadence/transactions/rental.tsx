/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as fcl from "@onflow/fcl";

// storefront initialised

async function createRental(
  listItemID: number,
  amount: string | undefined,
  deposit: string | undefined,
  term: string | undefined,
  expiry: string | undefined,
  renter: string | undefined
) {
  const txId = await fcl.mutate({
    cadence: `
    import FungibleToken from 0x9a0766d93b6608b7
    import NonFungibleToken from 0x631e88ae7f1d7c20
    import FiatToken from 0xa983fecbed621163
    
    import FlowtyRentals from 0xe1d43e0cfc237807
    import Flowty from 0xe1d43e0cfc237807
    
    import RealEstate from 0x157a74f09e842db3
    
    
    transaction(listItemID: UInt64, amount: UFix64, deposit: UFix64, term: UFix64, expiresAfter: UFix64, renter: Address?) {
        let receiver: Capability<&FiatToken.Vault{FungibleToken.Receiver}>
        let nftProvider: Capability<&AnyResource{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
        let storefront: &FlowtyRentals.FlowtyRentalsStorefront
        let nftReceiver: Capability<&AnyResource{NonFungibleToken.CollectionPublic}>
    
        prepare(acct: AuthAccount) {
                if(acct.borrow<&FlowtyRentals.FlowtyRentalsStorefront>(from: FlowtyRentals.FlowtyRentalsStorefrontStoragePath) == nil) {
                log("Setup Account NFT storefront sorage paths")
                // Create a new empty .Storefront
                let storefront <- FlowtyRentals.createStorefront() as! @FlowtyRentals.FlowtyRentalsStorefront
                
                // save it to the account
                acct.save(<-storefront, to: FlowtyRentals.FlowtyRentalsStorefrontStoragePath)
    
                // create a public capability for the .Storefront
                acct.link<&FlowtyRentals.FlowtyRentalsStorefront{FlowtyRentals.FlowtyRentalsStorefrontPublic}>(FlowtyRentals.FlowtyRentalsStorefrontPublicPath, target: FlowtyRentals.FlowtyRentalsStorefrontStoragePath)
            }
            
            if acct.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath) == nil {
                acct.save(<-FiatToken.createEmptyVault(), to: FiatToken.VaultStoragePath)
                acct.link<&FiatToken.Vault{FungibleToken.Receiver}>(
                    FiatToken.VaultReceiverPubPath,
                    target: FiatToken.VaultStoragePath
                )
                acct.link<&FiatToken.Vault{FungibleToken.Balance}>(
                    FiatToken.VaultBalancePubPath,
                    target: FiatToken.VaultStoragePath
                )
            }
            
            // We need a provider capability, but one is not provided by default so we create one if needed.
            let collectionProviderPrivatePath = /private/RealEstateCollectionProviderForFlowtyRentalsStorefront
            let publicCollectionPath = /public/RealEstatePublicCollectionFlowtyRentals
            let tokenProviderPrivatePath = /private/FiatTokenForFlowtyRentalsSmartContract
            
            let nftCollectionProviderPrivatePath = /private/RealEstateCollectionProviderForFlowtyRentalsStorefront
    
            self.receiver = acct.getCapability<&FiatToken.Vault{FungibleToken.Receiver}>(FiatToken.VaultReceiverPubPath)
            assert(self.receiver.check(), message: "Missing or mis-typed FiatToken receiver")
    
            if !acct.getCapability<&RealEstate.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftCollectionProviderPrivatePath)!.check() {
                        acct.unlink(nftCollectionProviderPrivatePath)
                        acct.link<&RealEstate.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftCollectionProviderPrivatePath, target: StoragePath(identifier: "cleeohiol0003mn0vopfokp54_RealEstate_nft_collection")!)
            }
    
            self.nftProvider = acct.getCapability<&AnyResource{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftCollectionProviderPrivatePath)!
            assert(self.nftProvider.check(), message: "Missing or mis-typed RealEstate.Collection provider")
    
            self.storefront = acct.borrow<&FlowtyRentals.FlowtyRentalsStorefront>(from: FlowtyRentals.FlowtyRentalsStorefrontStoragePath)
                ?? panic("Missing or mis-typed FlowtyRentals.FlowtyRentalsStorefront")
                
                    if !acct.getCapability<&AnyResource{NonFungibleToken.CollectionPublic}>(publicCollectionPath)!.check() {
                        acct.unlink(publicCollectionPath)
                        acct.link<&AnyResource{NonFungibleToken.CollectionPublic}>(publicCollectionPath, target: StoragePath(identifier: "cleeohiol0003mn0vopfokp54_RealEstate_nft_collection")!)
            }
            self.nftReceiver = acct.getCapability<&{NonFungibleToken.CollectionPublic}>(publicCollectionPath)!
            assert(self.nftReceiver.check(), message: "Missing or mis-typed RealEstate.Collection")
        }
    
        execute {
            let paymentCut = Flowty.PaymentCut(
                receiver: self.receiver,
                amount: amount
            )
    
            self.storefront.createListing(
                nftProviderCapability: self.nftProvider,
                nftPublicCollectionCapability: self.nftReceiver,
                ownerFungibleTokenReceiver: self.receiver,
                nftType: Type<@RealEstate.NFT>(),
                nftID: listItemID,
                amount: amount,
                deposit: deposit,
                term: term,
                paymentVaultType: Type<@FiatToken.Vault>(),
                paymentCut: paymentCut,
                expiresAfter: expiresAfter,
                renter: renter
            )
        }
    }
    
    `,
    args: (arg: any, t: any) => [
      arg(listItemID, t.UInt64),
      arg(amount, t.UFix64),
      arg(deposit, t.UFix64),
      arg(term, t.UFix64),
      arg(expiry, t.UFix64),
      arg(renter, t.Optional(t.Address)),
    ],
    // proposer : fcl.proposer,
    // payer: fcl.currentUser,
    limit: 9999,
  });

  const txn = await fcl.tx(txId).onceSealed();
  console.log(txn);
}

export default createRental;
