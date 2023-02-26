// eslint-disable 
import { useEffect, useState } from "react";
import { query, config } from "@onflow/fcl";
import Layout from "~/layouts/layout";

export default function Flovatar() {
  const [address, setAddress] = useState("0x2a0eccae942667be");
  const [amount, setAmount] = useState("");
  const [flovatars, setFlovatars] = useState([]);

  useEffect(() => {
    const showResult = (data, address) => {
      setAddress(address);
      setAmount(data.length);
      setFlovatars(data);
    };

    const getFlovatars = async (address) => {
      const cadence = `
        import Flovatar from 0x921ea449dffec68a

        pub struct Avatar{
          pub let id: UInt64
          pub let isCreator: Bool

          init(_ id: UInt64, _ isCreator: Bool){
            self.id = id
            self.isCreator = isCreator
          }
        }

        pub fun main(address:Address) : [Avatar] {
          let flovatars = Flovatar.getFlovatars(address: address)

          let data: [Avatar] = []

          for flovatar in flovatars{
            let isCreator = flovatar.metadata.creatorAddress == address
            let avatar = Avatar(flovatar.id, isCreator)
            data.append(avatar)
          }
          return data  
        }
      `;

      const args = (arg, t) => [arg(address, t.Address)];

      const flovatars = await query({ cadence, args });

      console.log(
        `${address} address have %c${
          flovatars.length + " flovatars in it's storage"
        }`,
        "color: #36ad68; font-weight: bold"
      );
      showResult(flovatars, address);
    };

    config().put("accessNode.api", "https://rest-mainnet.onflow.org");

    getFlovatars(address);
  }, []);

  return (
    <Layout>
    <div className="app">
      <h2 className="text-2xl text-center text-sky-400">Get a List of Flovatars Living at Known Address </h2>

      <div id="result" className="box">
        <p className="text-2xl text-center text-yellow-400 my-4">
          Account with address <span className="boxed">{address}</span>{" "}
          has{" "}
          <span className="bg-indigo-500">
            {amount}
          </span>{" "}
          flovatars in its storage.
        </p>
        <div className="grid grid-cols-3 gap-2 mx-24 p-8 my-44">
          {flovatars.map((flovatar) => (
            <>
            <img key={flovatar.id} src={`https://flovatar.com/api/image/${flovatar.id}`} className="h-40 hover:scale-150 cursor-pointer shadow-lg shadow-emerald-800 my-10" alt="images"/>
            <p>Flovatar {flovatar.id}</p>
            </>
          ))}
        </div>
      </div>
    </div>
    </Layout>
  );
}
