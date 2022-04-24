import { Bytes, Contract } from "ethers";
import { run, ethers } from "hardhat";
import * as dotenv from 'dotenv'

dotenv.config()


async function main() {

const abi = [
  "event Transfer(address indexed src, address indexed dst, uint val)"
];
var provider = new ethers.providers.AlchemyProvider('mumbai', process.env.ALCHEMY_KEY);

const spamDAOCurrentAddress = '0x2B6Ed92910f96126DA76ca0e3dF35e3427028A68';
const spamDAOContract = new Contract(spamDAOCurrentAddress, abi, provider);


// emit ProposalCreated(
//   proposalId,
//   _msgSender(),
//   targets,
//   values,
//   new string[](targets.length),
//   calldatas,
//   snapshot,
//   deadline,
//   description
// );

// List all token transfers *from* myAddress
spamDAOContract.filters.ProposalCreated()
// {
//   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
//   topics: [
//     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//     '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72'
//   ]
// }

const descriptionHash = ethers.utils.id('Post some shit');
console.log('description hashed: ', descriptionHash);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
