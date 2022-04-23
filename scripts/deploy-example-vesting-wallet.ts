import { run, ethers } from "hardhat";
import { BigNumber } from "ethers";
import { VestingWallet, ERC20Betrust } from "../typechain";

// deployment pipeline

// # deploy VestingWallet.sol
// ## set ERC20Betrust.sol address into VestingWallet.sol

async function main() {
  await run("compile");

  // assets on ropsten
  const weth = '0xd0a1e359811322d97991e03f863a0c30c2cf029c' // weth
  // constants
  const initialSupply: BigNumber = ethers.utils.parseEther("100");
  const treasurySupply: BigNumber = ethers.utils.parseEther("20");
  const firstVestingPeriodStart: number = 1643670200;
  const firstVestingPeriodDuration: number = 300;
  const secondVestingPeriodStart: number = firstVestingPeriodStart + firstVestingPeriodDuration;
  const secondVestingPeriodDuration: number = 720;
  // 30 days = 2700000
  // for purposes of speeding up the tests

  const [deployer,] = await ethers.getSigners();

  console.log("firstVestingPeriodStart: ", firstVestingPeriodStart)
  console.log("firstVestingPeriodDuration: ", firstVestingPeriodDuration)
  console.log("secondVestingPeriodStart: ", secondVestingPeriodStart)
  console.log("secondVestingPeriodDuration: ", secondVestingPeriodDuration)

  // Deploy the VestingWallet
  const vestingWallet = await ethers.getContractFactory('VestingWallet');
  // average month should be added
  const vestingWalletContract = await vestingWallet.deploy(firstVestingPeriodStart, firstVestingPeriodDuration, secondVestingPeriodStart, secondVestingPeriodDuration) as VestingWallet;
  await vestingWalletContract.deployed()
  console.log(`🍙 vestingWallet deployed at ${vestingWalletContract.address}\n`);


  // Deploy the ERC20Betrust
  // const erc20Betrust = await ethers.getContractFactory('ERC20Betrust')
  // const erc20BetrustContract = await erc20Betrust.deploy(vestingWalletContract.address, initialSupply, treasurySupply) as ERC20Betrust;
  // await erc20BetrustContract.deployed()

  // console.log(`🎄 erc20Betrust deployed at ${erc20BetrustContract.address}\n`)
  
  // wait for 5 blocks ( ~ 1m15s ) then verify contracts at the end, so we make sure etherscan is aware of their existence
    await new Promise(resolve => setTimeout(resolve, 50000))

    // VestingWallet
    await run("verify:verify", {
    address: vestingWalletContract.address,
    network: ethers.provider.network,
    constructorArguments: [
        firstVestingPeriodStart, 
        firstVestingPeriodDuration, 
        secondVestingPeriodStart, 
        secondVestingPeriodDuration
    ],
    contract: "contracts/VestingWallet.sol:VestingWallet"
    })

    // ERC20Betrust
    // await run("verify:verify", {
    // address: erc20BetrustContract.address,
    // network: ethers.provider.network,
    // constructorArguments: [
    //     vestingWalletContract.address,
    //     initialSupply,
    //     treasurySupply
    // ],
    // contract: "contracts/ERC20Betrust.sol:ERC20Betrust"
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
