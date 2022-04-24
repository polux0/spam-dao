import { Bytes } from "ethers";
import { run, ethers } from "hardhat";
import { SpamDAO__factory, ILensHub__factory, ERC721__factory} from "../typechain";


async function main() {


const spamDAO = await ethers.getContractFactory('SpamDAO')

// spamDAO.interface._encodeParams()

const profileId: number = 1533;
const contentURI: string = 'https://gateway.pinata.cloud/ipfs/QmQzbZkGkSX2g8EUeeySnR5weYNaM2r74Lu4b4qpqzUP4z';
const collectModule: string = '0x6027B03c00aCC750D55FFC6b6381bB748A9C8590'; //revert collect module
const collectModuleInitData: Bytes = [];
const referenceModule: string = ethers.constants.AddressZero;
const referenceModuleInitData: Bytes = []; 

// const examplePostData = ethers.utils.AbiCoder.prototype.encode(
//   ['uint256', 'string', 'string', 'bytes', 'address', 'bytes'],
//   [profileId, contentURI, collectModule, collectModuleInitData, referenceModule, referenceModuleInitData]
// );

const a = ILensHub__factory.createInterface().encodeFunctionData("post", [
  {
    profileId,
    contentURI,
    collectModule,
    collectModuleInitData,
    referenceModule,
    referenceModuleInitData,
  },
]);


const b = ERC721__factory.createInterface().encodeFunctionData("transferFrom", [
  "0x2B6Ed92910f96126DA76ca0e3dF35e3427028A68",
  "0xFd37f4625CA5816157D55a5b3F7Dd8DD5F8a0C2F",
  1533
])
// console.log('example post data ( encoded ): \n', a);

// console.log('example post data erc721Factory\n' + b);

const descriptionHash = ethers.utils.id('Transfer token to maggo');
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
