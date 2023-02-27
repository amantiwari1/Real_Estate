import { Transaction, Account } from "@onflow/flow-js-sdk";
import { authorization } from "./flow";
import * as fcl from "@onflow/fcl";

async function createListing(collectionIdentifier: string, saleItemID: number, saleItemPrice: number, customID: string | undefined, buyer: string | undefined, expiry: number) {
  const tx = await fcl.send([
    new Transaction(`
      import DapperUtilityCoin from 0x82ec283f88a62e65
      import FungibleToken from 0x9a0766d93b6608b7
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import MetadataViews from 0x631e88ae7f1d7c20
      import NFTCatalog from 0x324c34e1c517e4db
      import NFTStorefrontV2 from 0xb051bdaddb672a33
      import TokenForwarding from 0x51ea0e37c27a1f1a
      
      transaction(collectionIdentifier: String, saleItemID: UInt64, saleItemPrice: UFix64, customID: String?, buyer: Address?, expiry: UInt64) {
        // the transaction code goes here
      }
    `),
    fcl.args([
      fcl.arg(collectionIdentifier, fcl.String),
      fcl.arg(saleItemID.toString(), fcl.UInt64),
      fcl.arg(saleItemPrice.toString(), fcl.UFix64),
      fcl.arg(customID, fcl.Optional(fcl.String)),
      fcl.arg(buyer, fcl.Optional(fcl.Address)),
      fcl.arg(expiry.toString(), fcl.UInt64),
    ]),
    fcl.proposer(authorization),
    fcl.payer(authorization),
    fcl.authorizations([authorization]),
    fcl.limit(100),
  ]);
  await fcl.tx(tx).onceSealed();
}

export default createListing;