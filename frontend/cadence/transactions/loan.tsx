/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as fcl from "@onflow/fcl";

// storefront initialised

async function loanForm(
  listItemID: number,
  amount: string | undefined,
  interestRate: string | undefined,
  term: string | undefined,
  autoRepaymentEnabled: boolean,
  loanExpiresAfter: string | undefined
) {
  const txId = await fcl.mutate({
    cadence: `
    import FungibleToken from 0x9a0766d93b6608b7
    import NonFungibleToken from 0x631e88ae7f1d7c20
    import FiatToken from 0xa983fecbed621163
    import Flowty from 0xe1d43e0cfc237807
    import RealEstate from 0x157a74f09e842db3
    transaction(listItemID: UInt64, amount: UFix64, interestRate: UFix64, term: UFix64, autoRepaymentEnabled: Bool, loanExpiresAfter: UFix64) {
        let tokenReceiver: Capability<&FiatToken.Vault{FungibleToken.Receiver}>
        let nftProvider: Capability<&RealEstate.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
        let storefront: &Flowty.FlowtyStorefront
        let nftReceiver: Capability<&AnyResource{NonFungibleToken.CollectionPublic}>
        let paymentVault: @FungibleToken.Vault
        let tokenProvider: Capability<&FiatToken.Vault{FungibleToken.Provider}>?
        prepare(acct: AuthAccount) {
                if(acct.borrow<&Flowty.FlowtyStorefront>(from: Flowty.FlowtyStorefrontStoragePath) == nil) {
                log("Setup Account NFT storefront storage paths")
                // Create a new empty .Storefront
                let storefront <- Flowty.createStorefront() as! @Flowty.FlowtyStorefront
                
                // save it to the account
                acct.save(<-storefront, to: Flowty.FlowtyStorefrontStoragePath)
                // create a public capability for the .Storefront
                acct.link<&Flowty.FlowtyStorefront{Flowty.FlowtyStorefrontPublic}>(Flowty.FlowtyStorefrontPublicPath, target: Flowty.FlowtyStorefrontStoragePath)
            }

            // We need a provider capability, but one is not provided by default so we create one if needed.
            let collectionProviderPrivatePath = /private/RealEstateCollectionProviderForFlowtyStorefront
            let publicCollectionPath = /public/RealEstatePublicCollectionFlowty
            let tokenProviderPrivatePath = /private/FiatTokenForFlowtySmartContract

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
            if autoRepaymentEnabled {
                acct.link<&FiatToken.Vault{FungibleToken.Provider}>(tokenProviderPrivatePath, target: FiatToken.VaultStoragePath)
                self.tokenProvider = acct.getCapability<&FiatToken.Vault{FungibleToken.Provider}>(tokenProviderPrivatePath)!
                assert(self.tokenProvider!.check(), message: "Missing or mis-typed FiatToken provider")
            } else {
                self.tokenProvider = nil
            }
            self.tokenReceiver = acct.getCapability<&FiatToken.Vault{FungibleToken.Receiver}>(FiatToken.VaultReceiverPubPath)!
            assert(self.tokenReceiver.check(), message: "Missing or mis-typed FiatToken receiver")
            if !acct.getCapability<&RealEstate.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(collectionProviderPrivatePath)!.check() {
                        acct.unlink(collectionProviderPrivatePath)
                        acct.link<&RealEstate.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(collectionProviderPrivatePath, target: StoragePath(identifier: "cleeohiol0003mn0vopfokp54_RealEstate_nft_collection")!)
            }
            self.nftProvider = acct.getCapability<&RealEstate.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(collectionProviderPrivatePath)!
            assert(self.nftProvider.check(), message: "Missing or mis-typed RealEstate.Collection provider")
            self.storefront = acct.borrow<&Flowty.FlowtyStorefront>(from: Flowty.FlowtyStorefrontStoragePath)
                ?? panic("Missing or mis-typed Flowty FlowtyStorefront")
            if !acct.getCapability<&AnyResource{NonFungibleToken.CollectionPublic}>(publicCollectionPath)!.check() {
                    acct.unlink(publicCollectionPath)
                acct.link<&AnyResource{NonFungibleToken.CollectionPublic}>(publicCollectionPath, target: StoragePath(identifier: "cleeohiol0003mn0vopfokp54_RealEstate_nft_collection")!)
            }
            self.nftReceiver = acct.getCapability<&AnyResource{NonFungibleToken.CollectionPublic}>(publicCollectionPath)!
            assert(self.nftReceiver.check(), message: "Missing or mis-typed RealEstate.Collection")
            let mainFusdVault = acct.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath)
                ?? panic("Cannot borrow FiatToken vault from acct storage")
            self.paymentVault <- mainFusdVault.withdraw(amount: Flowty.ListingFee)
            
            acct.link<&FiatToken.Vault{FungibleToken.Provider}>(tokenProviderPrivatePath, target: FiatToken.VaultStoragePath)
        }
        execute {
            let paymentCut = Flowty.PaymentCut(
                receiver: self.tokenReceiver,
                amount: amount
            )
            self.storefront.createListing(
                payment: <-self.paymentVault,
                nftProviderCapability: self.nftProvider,
                nftPublicCollectionCapability: self.nftReceiver,
                fusdProviderCapability: self.tokenProvider,
                nftType: Type<@RealEstate.NFT>(),
                nftID: listItemID,
                amount: amount,
                interestRate: interestRate,
                term: term,
                paymentVaultType: Type<@FiatToken.Vault>(),
                paymentCuts: [paymentCut],
                expiresAfter: loanExpiresAfter
            )
        }
    }
    
    `,
    args: (arg: any, t: any) => [
      arg(listItemID, t.UInt64),
      arg(amount, t.UFix64),
      arg(interestRate, t.UFix64),
      arg(term, t.UFix64),
      arg(autoRepaymentEnabled, t.Bool),
      arg(loanExpiresAfter, t.UFix64),
    ],
    // proposer : fcl.proposer,
    // payer: fcl.currentUser,
    limit: 9999,
  });

  const txn = await fcl.tx(txId).onceSealed();
  console.log(txn);
}

export default loanForm;
