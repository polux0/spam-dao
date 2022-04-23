import { run, ethers } from "hardhat";
import { BigNumber, utils } from "ethers";
import { ERC721Minter, Treasury, ERC20Betrust } from "../typechain";
import * as dotenv from 'dotenv'

dotenv.config()
// deployment pipeline

// # deploy ERC721Minter.sol
// ## deploy Treasury.sol
// ### deploy ERC20Betrust.sol
// #### set ERC20Betrust.sol address into Treasury.sol

async function main() {
  await run("compile");

  // assets on ropsten
  const weth = '0xd0a1e359811322d97991e03f863a0c30c2cf029c' // weth
  // constants
  const initialSupply: BigNumber = ethers.utils.parseEther("100");
  const treasurySupply: BigNumber = ethers.utils.parseEther("20");
  // ERC721Minter
  const start: number = 1645209480;
  // const baseUri: string = `ipfs://QmsXzQLxZQPYUMzGT61CTDYdC8JJm6CUw5gjuFxLKMoepL/`;
  // actual one
  const baseUri: string = `ipfs://QmdAuQLxZQPYUMzGT61CTDYdC8JJm6CUw5gjuFxLKMoepL/`;
  const firstVestingPeriodStart: number = 1645209480;
  const firstVestingPeriodDuration: number = 60;
  const firstVestingPeriodAllocation = 400;
  const secondVestingPeriodStart: number = firstVestingPeriodDuration + firstVestingPeriodDuration;
  const secondVestingPeriodDuration: number = 720;
  const secondVestingPeriodAllocation = 9600;
  // 30 days = 2700000
  // for purposes of speeding up the tests
  const averageMonth: number = 600;
  // const name = "Alexus test";
  const name = "Betrust Tier 1 NFT";
  // const symbol = "ATEST";
  const symbol = "BETNFT";

  const [deployer,] = await ethers.getSigners();

  console.log('baseUri: ', baseUri);
  
  console.log(`\n🤖 deployer address ${deployer.address}\n`)
  // Deploy the ERC721Minter
  const erc721Minter = await ethers.getContractFactory('ERC721Minter')
  const erc721MinterContract = await erc721Minter.deploy(start, baseUri, name, symbol) as ERC721Minter;
  await erc721MinterContract.deployed()
  console.log(`🎥 erc721Minter deployed at ${erc721MinterContract.address}\n`)

  // Deploy the VestingWallet
  // const treasury = await ethers.getContractFactory('Treasury');
  // // average month should be added
  // const treasuryContract = await treasury.deploy(firstVestingPeriodStart, firstVestingPeriodDuration, firstVestingPeriodAllocation, secondVestingPeriodStart, secondVestingPeriodDuration, secondVestingPeriodAllocation, erc721MinterContract.address) as Treasury;
  // await treasuryContract.deployed()
  // console.log(`🍙 treasury deployed at ${treasuryContract.address}\n`);

  // Deploy the ERC20Betrust
  // const erc20Betrust = await ethers.getContractFactory('ERC20Betrust')
  // const erc20BetrustContract = await erc20Betrust.deploy(treasuryContract.address, initialSupply, treasurySupply) as ERC20Betrust;
  // await erc20BetrustContract.deployed()

  // console.log(`🎄 erc20Betrust deployed at ${erc20BetrustContract.address}\n`)
  
  // set ERC20Betrust.address into Treasury
  // await new Promise(resolve => setTimeout(resolve, 30000))
  // try {
  //     await treasuryContract.connect(deployer).setERC20BetrustAddress(erc20BetrustContract.address);
  // } catch (error) {
  //   console.log('setting erc20Betrust.address in treasury contract threw an error: ', error)
  // }
  // wait for 5 blocks ( ~ 1m15s ) then verify contracts at the end, so we make sure etherscan is aware of their existence
  await new Promise(resolve => setTimeout(resolve, 50000))

  // ERC721Minter
  await run("verify:verify", {
    address: erc721MinterContract.address,
    network: ethers.provider.network,
    constructorArguments: [
      start,
      baseUri,
      name,
      symbol
    ],
    contract: "contracts/ERC721Minter.sol:ERC721Minter"
  })

  // VestingWallet
  // await run("verify:verify", {
  //   address: treasuryContract.address,
  //   network: ethers.provider.network,
  //   constructorArguments: [
  //     firstVestingPeriodStart, 
  //     firstVestingPeriodDuration, 
  //     firstVestingPeriodAllocation,
  //     secondVestingPeriodStart, 
  //     secondVestingPeriodDuration,
  //     secondVestingPeriodAllocation,
  //     treasuryContract.address
  //   ],
  //   contract: "contracts/Treasury.sol:Treasury"
  // })

  // ERC20Betrust
  // await run("verify:verify", {
  //   address: erc20BetrustContract.address,
  //   network: ethers.provider.network,
  //   constructorArguments: [
  //     treasuryContract.address,
  //     initialSupply,
  //     treasurySupply
  //   ],
  //   contract: "contracts/ERC20Betrust.sol:ERC20Betrust"
  // })

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
