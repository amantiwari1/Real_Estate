import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20
import FiatToken from 0xa983fecbed621163

import FlowtyRentals from 0xe1d43e0cfc237807
import Flowty from 0xe1d43e0cfc237807

import FlowtyTestNFT from 0xd9c02cdacccb25ab


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
        let collectionProviderPrivatePath = /private/FlowtyTestNFTCollectionProviderForFlowtyRentalsStorefront
        let publicCollectionPath = /public/FlowtyTestNFTPublicCollectionFlowtyRentals
        let tokenProviderPrivatePath = /private/FiatTokenForFlowtyRentalsSmartContract
        
        let nftCollectionProviderPrivatePath = /private/FlowtyTestNFTCollectionProviderForFlowtyRentalsStorefront

        self.receiver = acct.getCapability<&FiatToken.Vault{FungibleToken.Receiver}>(FiatToken.VaultReceiverPubPath)
        assert(self.receiver.check(), message: "Missing or mis-typed FiatToken receiver")

        if !acct.getCapability<&FlowtyTestNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftCollectionProviderPrivatePath)!.check() {
					acct.unlink(nftCollectionProviderPrivatePath)
					acct.link<&FlowtyTestNFT.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftCollectionProviderPrivatePath, target: StoragePath(identifier: "FlowtyTestNFTCollection")!)
        }

        self.nftProvider = acct.getCapability<&AnyResource{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftCollectionProviderPrivatePath)!
        assert(self.nftProvider.check(), message: "Missing or mis-typed FlowtyTestNFT.Collection provider")

        self.storefront = acct.borrow<&FlowtyRentals.FlowtyRentalsStorefront>(from: FlowtyRentals.FlowtyRentalsStorefrontStoragePath)
            ?? panic("Missing or mis-typed FlowtyRentals.FlowtyRentalsStorefront")
			
				if !acct.getCapability<&AnyResource{NonFungibleToken.CollectionPublic}>(publicCollectionPath)!.check() {
					acct.unlink(publicCollectionPath)
					acct.link<&AnyResource{NonFungibleToken.CollectionPublic}>(publicCollectionPath, target: StoragePath(identifier: "FlowtyTestNFTCollection")!)
        }
        self.nftReceiver = acct.getCapability<&{NonFungibleToken.CollectionPublic}>(publicCollectionPath)!
        assert(self.nftReceiver.check(), message: "Missing or mis-typed FlowtyTestNFT.Collection")
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
            nftType: Type<@FlowtyTestNFT.NFT>(),
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