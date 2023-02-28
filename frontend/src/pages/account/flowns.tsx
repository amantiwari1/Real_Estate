import { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Center,
  CopyButton,
  Paper,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import Layout from "~/layouts/layout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import Link from "next/link";

export interface DomainData {
  id: string;
  name: string;
  owner: string;
  nameHash: string;
  mediaUrl: string;
}

async function getDomainDetails(name: string): Promise<DomainData> {
  const apiUrl = `https://testnet.flowns.org/api/data/domain/${name}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

async function fetchImage(url: string) {
  const response = await fetch(url);

  const svgstr = await response.text();
  return svgstr;
}

async function fetchDomains(): Promise<DomainData[]> {
  const response = await fetch(
    "https://testnet.flowns.org/api/data/address/0x3c09a556ecca42dc"
  );
  const data = await response.json();
  return data;
}

function Domains() {
  const [searchQuery, setSearchQuery] = useState("");
  const [show, setShow] = useState(false);

  const { mutateAsync, data } = useMutation(
    ["domain", searchQuery],
    async (domain: string) => {
      return await getDomainDetails(domain);
    }
  );

  const { data: domains } = useQuery(["domains"], fetchDomains);

  return (
    <Layout>
      <div>
        <div className="my-5 flex items-center justify-center space-x-5">
          <Text>Search Domain</Text>
          <TextInput
            w={400}
            value={searchQuery}
            placeholder="Enter domain"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <Button
            color="indigo"
            onClick={() => {
              mutateAsync(searchQuery);
            }}
          >
            Search
          </Button>
        </div>
        {data && (
          <Center className="my-5">
            <div>
              <h2 className="text-3xl text-blue-400">{data.name}</h2>
              <p className="text-2xl text-green-200">Owner: {data.owner}</p>
              <p>Namehash: {data.nameHash}</p>
              <Link href={`/account/${data.name}`}>
                <Button color="violet" variant="light" mt={10} size="xs">
                  View Flowestate nft Collection
                </Button>
              </Link>
            </div>
          </Center>
        )}
        <div className="mt-5 flex justify-center">
          <Button color="indigo" onClick={() => setShow(!show)}>
            Show List of Flowns Domains
          </Button>
        </div>
        {show && (
          <>
            <h1 className="mt-5 text-center text-3xl">Domain List</h1>
            <ul className="my-5 grid gap-5 md:grid-cols-4">
              {domains?.map((domain) => (
                <DomainCard domain={domain} key={domain.id} />
              ))}
            </ul>
          </>
        )}
      </div>
    </Layout>
  );
}

const DomainCard = ({ domain }: { domain: DomainData }) => {
  const url = domain.mediaUrl;
  const { data } = useQuery(["image", domain.id], () => fetchImage(url));
  return (
    <Paper shadow="xl" bg="#17233a" radius="md">
      <div>
        {data && (
          <div
            dangerouslySetInnerHTML={{
              __html: data
                .replace('width="400"', 'class="rounded-xl"')
                .replace('height="600"', ""),
            }}
          />
        )}
      </div>

      <div className="p-5">
        <IconCopyButton value={domain.owner} label={domain.owner} />
        <IconCopyButton value={domain.name} label={domain.name} />
        <Link href={`/account/${domain.name}`}>
          <Button color="violet" variant="light" mt={10} size="xs">
            View FlowEstate Collection
          </Button>
        </Link>
      </div>
    </Paper>
  );
};

const IconCopyButton = ({ value, label }: { value: string; label: string }) => {
  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <div>
          <Tooltip
            label={copied ? "Copied" : "Copy"}
            withArrow
            position="right"
          >
            <div className="flex space-x-5">
              {label}
              <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </ActionIcon>
            </div>
          </Tooltip>
        </div>
      )}
    </CopyButton>
  );
};

export default Domains;
