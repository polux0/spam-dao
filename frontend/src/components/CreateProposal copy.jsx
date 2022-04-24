import React, { useState } from 'react';
import { create } from 'ipfs-http-client';

import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import * as Name from 'web3.storage/name'
import { Token } from '@usedapp/core';

const json = `{"version":"1.0.0","metadata_id":"59e196ad-3831-462a-bc14-a8c1920575fd","description":"{Platzhalter}","content":"{Platzhalter}","external_url":null,"image":null,"imageMimeType":null,"name":"Post by @spamDAO","attributes":[{"traitType":"string","key":"type","value":"post"}],"media":[],"appId":"spamDAO"}`

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3RmI4NDM3ZDEwREVBNTJhMjdlMzhmMTE5MzRlQmY3MzExRDgyYTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTA3MzE0MDY5OTYsIm5hbWUiOiJFdGhBbXN0ZXJkYW0tSGFja2F0aG9uIn0.mttOo2oX_sStHJQ3zS3UsErMGGINBrLuSLqylpwgB9A';

export const CreateProposal = ({ style }) => {
    const [proposalText, setProposalText] = useState('');
    const [bla, setBla] = useState('leer')

    const storage = new Web3Storage({ TOKEN });
    const key = 'bafybeigo5qrfmhxnhonevbw4md256n7mws6a33rrbn2723eh6lsxvzhnnm';
    const path = `https://dweb.link/ipfs/${key}/1.txt`;
    const client = new Web3Storage({ token: TOKEN })
    const blob = new Blob(["Lala"], { type: "text/plain;charset=utf-8" });

    function submitProposal() {
        const payload = json.replace('{Platzhalter}', proposalText)+'\n';

    }

    fetch(path).then(response => response.text()).then(r => {console.log(r);return r;}).then(setBla)

    async function upload() {
        const fileInput = document.querySelector('input[type="file"]');
        console.log('upload', fileInput.files);
        // const rootCid = await client.put(fileInput.files, {
        //     name: 'cat pics',
        //     maxRetries: 3
        // });
        // console.log(rootCid)
    }

    return <div style={style}>
        <textarea value={proposalText} onChange={e => setProposalText(e.target.value)} />
        <button type='button' onClick={submitProposal}>Porpose post</button>
        <br />
        <input type='file' />
        <button type='button' onClick={upload}>Upload</button>
        <div>Bla ist: {bla}</div>
    </div>
}