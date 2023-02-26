/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable
import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { query, config } from "@onflow/fcl";
import Layout from "~/layouts/layout";
import { Center, Loader, Text, TextInput } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@mantine/hooks";

const getFlovatars = async (address: string) => {
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

  const args = (arg: any, t: any) => [arg(address, t.Address)];

  return (await query({ cadence, args })) as flovatarProps[];
};

interface flovatarProps {
  id: string;
}

export default function Flovatar() {
  const [address, setAddress] = useState<string>("0x2a0eccae942667be");

  const [debounced] = useDebouncedValue(address, 200);

  const { data, isLoading, refetch, isError } = useQuery(
    ["flovatars", debounced],
    async () => {
      try {
        return await getFlovatars(debounced);
      } catch (error) {
        console.log(error);
      }
    },
    {}
  );

  useEffect(() => {
    config().put("accessNode.api", "https://rest-mainnet.onflow.org");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="app">
        <h2 className="text-center text-2xl text-sky-400">
          Get a List of Flovatars Living at Known Address{" "}
        </h2>

        <div className="my-5 flex justify-center space-x-5">
          <TextInput
            label="Search Address"
            w={400}
            value={address}
            placeholder="Enter address"
            onChange={async (e) => {
              setAddress(e.target.value);
              await refetch();
            }}
            error={isError ? "Address not found" : ""}
          />
        </div>

        {isLoading && (
          <Center h="100%">
            <Loader />
          </Center>
        )}

        <div id="result" className="box">
          {!isLoading && data && data?.length > 0 && (
            <p className="my-4 text-center text-2xl text-yellow-400">
              Account with address <span className="boxed">{address}</span> has{" "}
              <span className="text-4xl font-bold text-violet-500">
                {data?.length}
              </span>{" "}
              flovatars in its storage.
            </p>
          )}
          <div className="mx-24 my-10 grid grid-cols-3 gap-2 p-8">
            {!isLoading &&
              data?.map((flovatar) => (
                <Center key={flovatar.id}>
                  <div>
                    <img
                      key={flovatar.id}
                      src={`https://flovatar.com/api/image/${flovatar.id}`}
                      className="my-10 h-40 cursor-pointer shadow-lg shadow-emerald-800 hover:scale-150"
                      alt="images"
                    />
                    <Text align="center">Flovatar {flovatar.id}</Text>
                  </div>
                </Center>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
