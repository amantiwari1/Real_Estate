import Flowty from 0xe1d43e0cfc237807
import FlowtyRentals from 0xe1d43e0cfc237807
import FlovatarMarketplace from 0x921ea449dffec68a
import Flovatar from 0x9392a4a7c3f49a0b
import FlovatarComponent from 0x9392a4a7c3f49a0b
import FIND from 0x097bafa4e0b48eef 

pub contract Rental {

    pub struct FlowtyListing {
		pub var listingId: UInt64
		pub var funded: Bool
		pub let nftIdentifier: String
		pub let nftId: UInt64
		pub let amount: UFix64
		pub let interestRate: UFix64
		pub var term: UFix64
		pub let paymentVaultType: String

		pub let paymentCuts: [StoreFrontCut]
		pub var listedTime: UFix64
		pub var royaltyRate: UFix64
		pub var listingValidUntil: UFix64
		pub var repaymentAmount: UFix64

		pub let tags: {String : String} 
		pub let scalars: {String : UFix64}
		pub let extra: {String : AnyStruct}

		init(flowtyStorefrontID: UInt64, funded: Bool, nftType: String, nftID: UInt64, amount: UFix64, interestRate: UFix64, term: UFix64, paymentVaultType: String,paymentCuts: [StoreFrontCut], listedTime: UFix64, royaltyRate: UFix64, expiresAfter: UFix64, repaymentAmount: UFix64) {
			self.listingId = flowtyStorefrontID
			self.funded = funded
			self.nftIdentifier = nftType
			self.nftId = nftID
			self.amount = amount
			self.interestRate = interestRate
			self.term = term
			self.paymentVaultType = paymentVaultType
			self.paymentCuts = paymentCuts
			self.listedTime = listedTime
			self.royaltyRate = royaltyRate
			self.listingValidUntil = expiresAfter + listedTime
			self.repaymentAmount = repaymentAmount
			self.tags={}
			self.scalars={}
			self.extra={}
		}
	}

    pub struct FlowtyRental {
		pub var listingId: UInt64
		pub var rented: Bool
		pub let nftIdentifier: String
		pub let nftId: UInt64
		pub let amount: UFix64
		pub let deposit: UFix64
		pub var term: UFix64
		pub let paymentVaultType: String
		pub let reenableOnReturn: Bool

		pub let paymentCuts: [StoreFrontCut]
		pub var listedTime: UFix64
		pub var royaltyRate: UFix64
		pub var listingValidUntil: UFix64
		pub var repaymentAmount: UFix64
		pub var renter: Address? 
		pub var renterName: String? 

		pub let tags: {String : String} 
		pub let scalars: {String : UFix64}
		pub let extra: {String : AnyStruct}

		init(flowtyStorefrontID: UInt64, rented: Bool, nftType: String, nftID: UInt64, amount: UFix64, deposit: UFix64, term: UFix64, paymentVaultType: String, reenableOnReturn:Bool, paymentCuts: [StoreFrontCut], listedTime: UFix64, royaltyRate: UFix64, expiresAfter: UFix64, repaymentAmount: UFix64, renter: Address?) {
			self.listingId = flowtyStorefrontID
			self.rented = rented
			self.nftIdentifier = nftType
			self.nftId = nftID
			self.deposit = deposit
			self.amount = amount
			self.term = term
			self.paymentVaultType = paymentVaultType
			self.reenableOnReturn = reenableOnReturn
			self.paymentCuts = paymentCuts
			self.listedTime = listedTime
			self.royaltyRate = royaltyRate
			self.listingValidUntil = expiresAfter + listedTime
			self.repaymentAmount = repaymentAmount
			self.renter = renter
			self.renterName = nil 
			if renter != nil {
				self.renterName = FIND.reverseLookup(renter!)
			}
			self.tags={}
			self.scalars={}
			self.extra={}
		}
	}

    pub struct FlovatarListing {
		pub var listingId: UInt64
		pub let nftIdentifier: String
		pub let nftId: UInt64
		pub let ftTypeIdentifier: String
		pub let amount: UFix64
		pub let cuts: [StoreFrontCut]
		pub let accessoryId: UInt64?
		pub let hatId: UInt64?
		pub let eyeglassesId: UInt64?
		pub let backgroundId: UInt64?
		pub let mint: UInt64
		pub let series: UInt32
		pub let creatorAddress: Address
		pub let components: {String: UInt64}
		pub let rareCount: UInt8
		pub let epicCount: UInt8
		pub let legendaryCount: UInt8
		pub let tags: {String : String} 
		pub let scalars: {String : UFix64}
		pub let extra: {String : AnyStruct}

		init(storefrontID: UInt64, nftType: String, nftID: UInt64, salePaymentVaultType: String, salePrice: UFix64, saleCuts: [StoreFrontCut], flovatarMetadata: FlovatarMarketplace.FlovatarSaleData) {
			self.listingId = storefrontID
			self.nftIdentifier = nftType
			self.nftId = nftID
			self.ftTypeIdentifier = salePaymentVaultType
			self.amount = salePrice
			self.cuts = saleCuts
			let f = flovatarMetadata
			self.accessoryId = f.accessoryId
			self.hatId = f.hatId
			self.eyeglassesId = f.eyeglassesId
			self.backgroundId = f.backgroundId
			let d = f.metadata
			self.mint = d.mint
			self.series = d.series
			self.creatorAddress = d.creatorAddress
			self.components = d.getComponents()
			self.rareCount = d.rareCount
			self.epicCount = d.epicCount
			self.legendaryCount = d.legendaryCount
			self.tags={}
			self.scalars={}
			self.extra={}
		}
	}

	pub struct FlovatarComponentListing {
		pub var listingId: UInt64
		pub let nftIdentifier: String
		pub let nftId: UInt64
		pub let ftTypeIdentifier: String
		pub let amount: UFix64
		pub let cuts: [StoreFrontCut]
		pub let mint: UInt64
		pub let templateId: UInt64
		pub let name: String
		pub let description: String
		pub let category: String
		pub let rarity: String
		pub let color: String
		pub let tags: {String : String} 
		pub let scalars: {String : UFix64}
		pub let extra: {String : AnyStruct}

		init(storefrontID: UInt64, nftType: String, nftID: UInt64, salePaymentVaultType: String, salePrice: UFix64, saleCuts: [StoreFrontCut], flovatarComponentMetadata: FlovatarMarketplace.FlovatarComponentSaleData) {
			self.listingId = storefrontID
			self.nftIdentifier = nftType
			self.nftId = nftID
			self.ftTypeIdentifier = salePaymentVaultType
			self.amount = salePrice
			self.cuts = saleCuts
			let f = flovatarComponentMetadata.metadata
			self.mint = f.mint
			self.templateId = f.templateId
			self.name = f.name
			self.description = f.description
			self.category = f.category
			self.rarity = f.rarity
			self.color = f.color
			self.tags={}
			self.scalars={}
			self.extra={}
		}
	}

	pub fun getFlowtyListing(user: Address, id: UInt64, type: Type) : FlowtyListing? {
		var flowty : FlowtyListing? = nil
		let account = getAccount(user)
		let flowtyCap = account.getCapability<&Flowty.FlowtyStorefront{Flowty.FlowtyStorefrontPublic}>(Flowty.FlowtyStorefrontPublicPath)

		if flowtyCap.check() {
			let storefrontRef=flowtyCap.borrow()!
			for listingId in storefrontRef.getListingIDs() {
				let listing = storefrontRef.borrowListing(listingResourceID: listingId)!
				let d = listing.getDetails()
				if d.nftID!=id || d.nftType != type {
					continue 
				}
				if d.funded {
					continue 
				}
				let saleCuts : [StoreFrontCut] = [] 
				for cut in d.getPaymentCuts() {
					saleCuts.append(
						StoreFrontCut(
							amount: cut.amount, 
							address: cut.receiver.address
						)
					)
				}
				flowty = FlowtyListing(flowtyStorefrontID: d.flowtyStorefrontID, funded: d.funded, nftType: d.nftType.identifier, nftID: d.nftID, amount: d.amount, interestRate: d.interestRate, term: d.term, paymentVaultType: d.paymentVaultType.identifier ,paymentCuts: saleCuts, listedTime: d.listedTime, royaltyRate: d.royaltyRate, expiresAfter: d.expiresAfter, repaymentAmount: d.getTotalPayment())
				return flowty
			}
		}
		return nil
	}

	pub fun getFlovatarListing(user: Address, id: UInt64, type: Type) : FlovatarListing? {
		let nftType = Type<@Flovatar.NFT>()
		if type != nftType {
			return nil
		}
		let flovatar = FlovatarMarketplace.getFlovatarSale(address: user, id: id)
		if flovatar == nil {
			return nil
		}
		let f = flovatar!
		let saleCuts : [StoreFrontCut] = [] 
		let creatorCut = Flovatar.getRoyaltyCut() 
		let marketCut = Flovatar.getMarketplaceCut() 
		saleCuts.appendAll([
			StoreFrontCut(
				amount: creatorCut, 
				address: f.metadata.creatorAddress
			), 
			StoreFrontCut(
				amount: marketCut, 
				address: FlovatarMarketplace.marketplaceWallet.address
			) 
		])
		return FlovatarListing(storefrontID: f.id, nftType: nftType.identifier, nftID: f.id, salePaymentVaultType: Type<@FlowToken.Vault>().identifier, salePrice: f.price, saleCuts: saleCuts, flovatarMetadata: f)
	}

	pub fun getFlovatarComponentListing(user: Address, id: UInt64, type: Type) : FlovatarComponentListing? {
		let nftType = Type<@FlovatarComponent.NFT>()
		if type != nftType {
			return nil
		}
		let flovatar = FlovatarMarketplace.getFlovatarComponentSale(address: user, id: id)
		if flovatar == nil {
			return nil
		}
		let f = flovatar!
		let saleCuts : [StoreFrontCut] = [] 
		let creatorCut = Flovatar.getRoyaltyCut() 
		let marketCut = Flovatar.getMarketplaceCut() 
		saleCuts.appendAll([
			StoreFrontCut(
				amount: marketCut, 
				address: FlovatarMarketplace.marketplaceWallet.address
			) 
		])
		return FlovatarComponentListing(storefrontID: f.id, nftType: nftType.identifier, nftID: f.id, salePaymentVaultType: Type<@FlowToken.Vault>().identifier, salePrice: f.price, saleCuts: saleCuts, flovatarComponentMetadata: f)
	}
}
