import React, { useState, useEffect } from 'react'
import { create, Options } from 'ipfs-http-client'
import { v4 } from 'uuid'
import { ethers, utils } from 'ethers';
import { useContractFunction } from '@usedapp/core'

import { ABI, Lens_ABI, PROPOSE, POST_ADDRESS, PolygonMumbai } from '../constants';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3RmI4NDM3ZDEwREVBNTJhMjdlMzhmMTE5MzRlQmY3MzExRDgyYTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTA3MzE0MDY5OTYsIm5hbWUiOiJFdGhBbXN0ZXJkYW0tSGFja2F0aG9uIn0.mttOo2oX_sStHJQ3zS3UsErMGGINBrLuSLqylpwgB9A';
const client = create('https://ipfs.infura.io:5001/api/v0');

const jsonLens = `{
    "version":"1.0.0",
    "metadata_id":"{UUIDV4}",
    "description":"{Platzhalter}",
    "content":"{Platzhalter}",
    "external_url":null,
    "image":null,
    "imageMimeType":null,
    "name":"Post by @spamDAO",
    "attributes":
    [
        {
            "traitType":"string",
            "key":"type",
            "value":"post"
            }
    ],
    "media":[],
    "appId":"Lenster"
}`;

export const CreateProposal = ({ style, proposals, setCodes }) => {
    const [proposalText, setProposalText] = useState('');
    const contract = new ethers.Contract(PROPOSE[PolygonMumbai.chainId], new utils.Interface(ABI));
    const { send:propose } = useContractFunction(contract, 'propose');

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const interfaceLens = new utils.Interface(Lens_ABI);
    // const { send:postLens } = useContractFunction(interfaceLens, 'post');

    function submitProposal() {
        const jsonToSend = jsonLens.replace('{UUIDV4}', v4()).replace('{Platzhalter}', proposalText).replace('{Platzhalter}', proposalText);
        console.log('jsonToSend', jsonToSend);
        client.add(jsonToSend)
        // .then(r => {console.log('====-----=====', r);return r;})
        .then(newHash => {
            let keys = Object.keys(localStorage);
            if(!keys.includes('codes')){
                localStorage.setItem('codes', '[]')
            }
            const codesString = localStorage.getItem('codes');
            const codesList = JSON.parse(codesString);
            codesList.push(newHash.path);
            localStorage.setItem('codes', JSON.stringify(codesList));
            setCodes(codesList);
            return newHash
        })
        .then(lala => {
            console.log(lala);
            const targets = [POST_ADDRESS];
            const values = [0];
            const calldatas = interfaceLens.encodeFunctionData("post", [[
                1533,
                'https://gateway.pinata.cloud/ipfs/' + lala.path,
                '0x6027B03c00aCC750D55FFC6b6381bB748A9C8590',
                [],
                ethers.constants.AddressZero,
                [],
              ]],
              );
            const description = proposalText;
            const signerContract = contract.connect(signer);
            signerContract.propose(targets, values,  calldatas, description);
        })
    }

    return <div style={style}>
        <textarea value={proposalText} onChange={e => setProposalText(e.target.value)} />
        <button type='button' onClick={submitProposal}>Porpose post</button>
    </div>
}

// {"types":1,"values":6},
// value=
// {
//     "types":[
//         {"name":"vars",
//         "type":"tuple",
//         "indexed":null,
//         "components":[
//             {"name":"profileId",
//             "type":"uint256",
//             "indexed":null,
//             "components":null,
//             "arrayLength":null,
//             "arrayChildren":null,
//             "baseType":"uint256",
//             "_isParamType":true
//         },
//         {
//             "name":"contentURI",
//             "type":"string",
//             "indexed":null,
//             "components":null,
//             "arrayLength":null,
//             "arrayChildren":null,
//             "baseType":"string",
//             "_isParamType":true
//         },
//         {
//             "name":"collectModule",
//             "type":"address",
//             "indexed":null,
//             "components":null,
//             "arrayLength":null,
//             "arrayChildren":null,
//             "baseType":"address",
//             "_isParamType":true
//         },
//         {
//             "name":"collectModuleData",
//             "type":"bytes",
//             "indexed":null,
//             "components":null,
//             "arrayLength":null,
//             "arrayChildren":null,
//             "baseType":"bytes",
//             "_isParamType":true
//         },
//         {
//             "name":"referenceModule",
//             "type":"address",
//             "indexed":null,
//             "components":null,
//             "arrayLength":null,
//             "arrayChildren":null,
//             "baseType":"address",
//             "_isParamType":true
//         },
//         {
//             "name":"referenceModuleData",
//             "type":"bytes",
//             "indexed":null,
//             "components":null,
//             "arrayLength":null,
//             "arrayChildren":null,
//             "baseType":"bytes",
//             "_isParamType":true
//         }
//     ],
//     "arrayLength":null
//     "arrayChildren":null
//     "baseType":"tuple"
//     "_isParamType":true
// }
// ],
// "values":[
//     1533,
//     "https://gateway.pinata.cloud/ipfs/QmXZVmT6Fp4Ld3Ak2Z5S33qnnM4veEMumbX8RKvghZb8s2",
//     "0x6027B03c00aCC750D55FFC6b6381bB748A9C8590",
//     [],
//     "0x0000000000000000000000000000000000000000",
//     []]
// },
 
// const bla = '0x963ff141000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000005fd00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000006027b03c00acc750d55ffc6b6381bb748a9c8590000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000005068747470733a2f2f676174657761792e70696e6174612e636c6f75642f697066732f516d517a625a6b476b53583267384555656579536e52357765594e614d327237344c753462347170717a5550347a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'