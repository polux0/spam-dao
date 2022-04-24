import { run, ethers } from "hardhat";
import { SpamDAO } from "../typechain";
import * as dotenv from 'dotenv'

dotenv.config()
// deployment pipeline

// # deploy Governor.sol

async function main() {
  await run("compile");

  // assets on ropsten
  const lensHubProxyAddress = '0x4BF0c7AD32Fd2d32089790a54485e23f5C7736C0'
  // constants
  const [deployer,] = await ethers.getSigners();
  
  console.log(`\n🤖 deployer address ${deployer.address}\n`)
  // Deploy the ERC721Minter
  const spamDAO = await ethers.getContractFactory('SpamDAO')
  const spamDAOContract = await spamDAO.deploy(lensHubProxyAddress) as SpamDAO;
  await spamDAOContract.deployed()
  console.log(`\n📜 SpamDAO governor deployed at ${spamDAOContract.address}\n`)

  // wait for 5 blocks ( ~ 1m15s ) then verify contracts at the end, so we make sure etherscan is aware of their existence
  await new Promise(resolve => setTimeout(resolve, 50000))

  // ERC721Minter
  await run("verify:verify", {
    address: spamDAOContract.address,
    network: ethers.provider.network,
    constructorArguments: [
      lensHubProxyAddress
    ],
    contract: "contracts/SpamDAO.sol:SpamDAO"
  })

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
