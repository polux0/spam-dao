import { Bytes } from "ethers";
import { run, ethers } from "hardhat";

async function main() {

const profileId: number = 0x05c0;
const contentURI: string = 'https://gateway.pinata.cloud/ipfs/QmQzbZkGkSX2g8EUeeySnR5weYNaM2r74Lu4b4qpqzUP4z';
const collectModule: string = '0x322b0Fe528E3F69130Dca663F7563C0f782cD076';
const collectModuleInitData: Bytes = [];
const referenceModule: string = ethers.constants.AddressZero;
const referenceModuleInitData: Bytes = []; 

const examplePostData = ethers.utils.AbiCoder.prototype.encode(
  ['uint256', 'string', 'string', 'bytes', 'address', 'bytes'],
  [profileId, contentURI, collectModule, collectModuleInitData, referenceModule, referenceModuleInitData]
);

console.log('example post data ( encoded ): \n', examplePostData);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
