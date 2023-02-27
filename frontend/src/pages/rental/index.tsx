import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { config } from "@onflow/fcl";

function Rental() {
  const [catalog, setCatalog] = useState<{[key: string]: any}>({});

  async function executeCadence(): Promise<{[key: string]: any}> {
    const response = await fcl.send([
      fcl.script(`
        import NFTCatalog from 0x324c34e1c517e4db
  
        pub fun main(): {String: NFTCatalog.NFTCatalogMetadata} {
          let catalog = NFTCatalog.getCatalog()
          let keys = catalog.keys.slice(from: 0, upTo: 20)
          let collections: {String: NFTCatalog.NFTCatalogMetadata} = {}
  
          for key in keys {
            collections[key] = catalog[key]
          }
  
          return collections
        }
      `)
    ]);
  
    const data = await fcl.decode(response);
    console.log(data);
    return data;
  }
  
  useEffect(() => {
    config().put("accessNode.api", "https://rest-testnet.onflow.org");

    async function fetchData() {
      const data = await executeCadence();
      setCatalog(data);
    }

    fetchData();
  }, []);




  return (
    // Render the catalog data
    <h1>Hello</h1>
  );
}

export default Rental;