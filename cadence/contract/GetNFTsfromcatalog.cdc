import MetadataViews from 0x1d7e57aa55817448
import NFTCatalog from 0x49a7cda3a1eecc29
import NFTRetrieval from 0x49a7cda3a1eecc29

pub struct NFT {
    pub let id: UInt64
    pub let name: String
    pub let description: String
    pub let thumbnail: String
    pub let externalURL: String
    pub let storagePath: StoragePath
    pub let publicPath: PublicPath
    pub let privatePath: PrivatePath
    pub let publicLinkedType: Type
    pub let privateLinkedType: Type
    pub let collectionIdentifier: String
    pub let collectionName: String
    pub let collectionDescription: String
    pub let collectionSquareImage: String
    pub let collectionBannerImage: String
    pub let royalties: [MetadataViews.Royalty]

    init(
        id: UInt64,
        name: String,
        description: String,
        thumbnail: String,
        externalURL: String,
        storagePath: StoragePath,
        publicPath: PublicPath,
        privatePath: PrivatePath,
        publicLinkedType: Type,
        privateLinkedType: Type,
        collectionIdentifier: String,
        collectionName: String,
        collectionDescription: String,
        collectionSquareImage: String,
        collectionBannerImage: String,
        royalties: [MetadataViews.Royalty]
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.externalURL = externalURL
        self.storagePath = storagePath
        self.publicPath = publicPath
        self.privatePath = privatePath
        self.publicLinkedType = publicLinkedType
        self.privateLinkedType = privateLinkedType
        self.collectionIdentifier = collectionIdentifier
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
        self.royalties = royalties
    }
}

pub fun main(ownerAddress: Address): {String: [NFT]} {
    let catalog = NFTCatalog.getCatalog()
    let account = getAuthAccount(ownerAddress)
    let items: [NFTRetrieval.BaseNFTViewsV1] = []
    let data: {String: [NFT]} = {}

    for key in catalog.keys {
        let value = catalog[key]!
        let keyHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(key.utf8))
        let tempPathStr = "catalog".concat(keyHash)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!

        account.link<&{MetadataViews.ResolverCollection}>(
            tempPublicPath,
            target: value.collectionData.storagePath
        )

        let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)

        if !collectionCap.check() {
            continue
        }

        let views = NFTRetrieval.getNFTViewsFromCap(collectionIdentifier: key, collectionCap: collectionCap)

        let items: [NFT] = []

        for view in views {
            let displayView = view.display
            let externalURLView = view.externalURL
            let collectionDataView = view.collectionData
            let collectionDisplayView = view.collectionDisplay
            let royaltyView = view.royalties

            if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil || royaltyView == nil) {
                // This NFT does not have the proper views implemented. Skipping....
                continue
            }

            items.append(
                NFT(
                    id: view.id,
                    name: displayView!.name,
                    description: displayView!.description,
                    thumbnail: displayView!.thumbnail.uri(),
                    externalURL: externalURLView!.url,
                    storagePath: collectionDataView!.storagePath,
                    publicPath: collectionDataView!.publicPath,
                    privatePath: collectionDataView!.providerPath,
                    publicLinkedType: collectionDataView!.publicLinkedType,
                    privateLinkedType: collectionDataView!.providerLinkedType,
                    collectionIdentifier: key,
                    collectionName: collectionDisplayView!.name,
                    collectionDescription: collectionDisplayView!.description,
                    collectionSquareImage: collectionDisplayView!.squareImage.file.uri(),
                    collectionBannerImage: collectionDisplayView!.bannerImage.file.uri(),
                    royalties: royaltyView!.getRoyalties()
                )
            )
        }

        data[key] = items
    }

    return data
}