import { useEffect, useState } from 'react';
import {  TextInput } from "@mantine/core";
import Layout from "~/layouts/layout";

interface DomainData {
    id: string;
    name: string;
    owner: string;
    nameHash: string;
  }

function Domains() {
  const [domains, setDomains] = useState<DomainData[]>([]);
  const [domainData, setDomainData] = useState<DomainData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
//   const [img, setImg] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function fetchDomains() {
      const response = await fetch('https://testnet.flowns.org/api/data/address/0x3c09a556ecca42dc');
      const data = await response.json();
      console.log(data);
      setDomains(data);
    }
    fetchDomains();
  }, []);

//   useEffect(() => {
//     async function fetchImage() {
//       const response = await fetch('https://testnet.flowns.org/api/data/image/flownsname.fn');
//       const blob = await response.blob();
//       console.log(blob);
//       setImg(URL.createObjectURL(blob));
//     }
//     fetchImage();
//   }, []);

  async function getDomainDetails(name: string): Promise<any> {
    const apiUrl = `https://testnet.flowns.org/api/data/domain/${name}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    return data;
  }

  async function handleSearch() {
    const data = await getDomainDetails(searchQuery);
    setDomainData(data);
  }

  return (
    <Layout>
    <div>
      <div className="my-5 flex justify-center space-x-5">
          <TextInput
            label="Search Address"
            w={400}
            value={searchQuery}
            placeholder="Enter address"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <button className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded'
            onClick={handleSearch}>
            Search
          </button>
        </div>

        {domainData && (
            <div className='text-center'>
            <h2 className='text-3xl text-blue-400'>{domainData.name}</h2>
            <p className='text-2xl text-green-200'>Owner: {domainData.owner}</p>
            <p>Namehash: {domainData.nameHash}</p>
            </div>
        )}
        <div className='flex justify-center'>
            <button className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded my-6'
                onClick={()=> setShow(!show)}>
                Show All
            </button>
        </div>
        {show && (
            <>
            <h1 className='text-center text-3xl'>Domain List</h1>
            <ul className='flex flex-col items-center text-2xl my-4'>
            {domains.map((domain) => (
              <li key={domain.id}>{domain.id} {domain.name}</li>
            ))}
          </ul>
          </>)
        }
      
      

      {/* <object data={img} type="image/svg+xml" width="400" height="400">
        svg object not supported
      </object> */}
    </div>
    </Layout>
  );
}

export default Domains;
