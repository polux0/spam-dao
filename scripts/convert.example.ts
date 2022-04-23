import { run, ethers } from "hardhat";

async function main() {
  const initialMetadata = "QmehUeWdGzgn3vdb5fdCye2C1jtNsxhe7gHW94PKrJBGkP";
  const metadataToBytesExample = ethers.utils.base58.decode(initialMetadata);
  const metadataToBytesExampleSliced = ethers.utils.base58.decode(initialMetadata).slice(2);
  const metadataAsBytes32 = ethers.utils.hexlify(metadataToBytesExampleSliced).replace('0x', '');
  const toInitialMetadata = ethers.utils.base58.encode("0x1220" + metadataAsBytes32);

  console.log("initialMetadata: ", initialMetadata);
  console.log("metadataToBytesExample: ", ethers.utils.hexlify(metadataToBytesExample));
  console.log("metadataToBytesExampleSliced: ", ethers.utils.hexlify(metadataToBytesExampleSliced));
  console.log("metadataAsBytes32: ", metadataAsBytes32);
  console.log("toInitialMetadata: ", toInitialMetadata);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
