import React, { useState, useEffect } from "react";
import { ConnectWallet } from "./ConnectWallet";
import { CreateProposal } from "./CreateProposal";
import { Proposal } from "./Proposal";

const classes = {
  headerOuter: {
    display: "grid",
    backgroundColor: "#6fd",
  },
  headerInner: {
    display: "grid",
    margin: "10px",
  },
  createProposal: {
    display: "grid",
  },
  listItem: {
    display: "grid",
    gap: "5px",
    listStyle: "none",
    margin: "10px 0px",
    padding: "5px",
    border: "solid black 1px",
    borderRadius: "5px",
  },
  proposalState: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 5fr 1fr",
    gap: "5px",
  },
};
const nextMonth = 1658586952954;
const januar = 1645630552954;

// const keys = ['QmSZYa3dimCDpxDgXmDggrjikQGE5TmPnK7Q2Nz68vt5KD', 'QmSMMBcTcR2cGDC4mtRnBAKJkiXDBke7Wrkaq63NX1LsJ8', 'QmZHMTNn28i3gbQezE3MFtGXA6UFwmDaHd9vccADW7JTFw'];

export const Main = () => {
  const [codes, setCodes] = useState(JSON.parse(localStorage.getItem("codes")));
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const promises = codes?.map((code) => {
      const path = `https://ipfs.infura.io/ipfs/${code}/`;
      return fetch(path)
        .then((response) => response.text())
        .then((text) => {
          // console.log(text);
          return { code, text };
        });
    });
    Promise.all(promises).then((responses) => {
      setProposals(responses);
    });
  }, [codes]);

  return (
    <>
      <div style={classes.headerOuter}>
        <ConnectWallet style={classes.headerInner} />
      </div>
      <div style={{ margin: "10px" }}>
        <CreateProposal
          style={classes.createProposal}
          proposals={proposals}
          setCodes={setCodes}
        />
        <h1>Proposals</h1>
        <ul style={{ paddingInlineStart: "unset" }}>
          {proposals.map((proposal) => (
            <Proposal proposal={proposal} classes={classes} />
          ))}
        </ul>
      </div>
    </>
  );
};
