import { ethers, waffle } from "hardhat";
import { BigNumber, BigNumberish, utils } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import * as fs from "fs";
import { ERC20Betrust, ERC721Minter, Treasury } from "../../../typechain";
import {VestingErrors, OwnableErrors} from "../../utils/Errors";


const mnemonic = fs.existsSync(".secret")
  ? fs.readFileSync(".secret").toString().trim()
  : "test test test test test test test test test test test junk";

  describe("Treasury", function () {
    
    let provider = waffle.provider;
    let accounts: SignerWithAddress[];
    let erc721Minter: ERC721Minter;
    let treasury: Treasury;
    let erc20Betrust: ERC20Betrust;
    let owner: SignerWithAddress;
    let minter1: SignerWithAddress;
    let minter2: SignerWithAddress;
    let minter3: SignerWithAddress;
    let minter4: SignerWithAddress;
    let currentTimestamp: Number;
    let start: BigNumber = BigNumber.from(0);
    // constants
    const tier1: BigNumber = BigNumber.from(parseInt("1"));
    const tier1Price: BigNumber = ethers.utils.parseEther("0.001");
    // 400 bps
    const firstVestingPeriodAllocationPercentage: BigNumber = BigNumber.from(400);
    // 9600 bps
    const secondVestingPeriodAllocationPercentage: BigNumber = BigNumber.from(9600);
    const basisPointDivisor: BigNumber = BigNumber.from(10000);
    const initialSupply: BigNumber = ethers.utils.parseEther("100");
    const treasurySupply: BigNumber = ethers.utils.parseEther("10");
    const baseUri: string = "https://ipfs.io/ipfs/QmehUeWdGzgn3vdb5fdCye2C1jtNsxhe7gHW94PKrJBGkP";
    const name: string = "BetrustTier1NFT";
    const symbol: string = "BTRT1NFT";
    const firstVestingPeriodId: BigNumber = BigNumber.from(0);
    const firstVestingPeriodDuration: BigNumber = BigNumber.from(2);
    const secondVestingPeriodId: BigNumber = BigNumber.from(1);
    let secondVestingPeriodStart: BigNumber = BigNumber.from(0);
    const secondVestingPeriodDuration: BigNumber = BigNumber.from(60);

    this.beforeAll("Set accounts", async () => {
      accounts = await ethers.getSigners();
      const [_owner, _minter1, _minter2, _minter3, _minter4] = accounts;
      owner = _owner;
      minter1 = _minter1;
      minter2 = _minter2;
      minter3 = _minter3;
      minter4 = _minter4;
    });
  
    this.beforeAll("Set timestamps", async () => {
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);
      currentTimestamp = block.timestamp;
      // 5 seconds from now
      start = BigNumber.from(parseInt(currentTimestamp.toString()) + 5);
      secondVestingPeriodStart = start.add(firstVestingPeriodDuration);
    });
  
    describe("deployment test", () => {
      it("deploy", async () => {
        const mockMinter721Contract = await ethers.getContractFactory("ERC721Minter");
        erc721Minter = (await mockMinter721Contract.deploy(start, baseUri, name, symbol)) as ERC721Minter;

        const mockTreasuryContract = await ethers.getContractFactory("Treasury");
        treasury = (await mockTreasuryContract.deploy(start, firstVestingPeriodDuration, firstVestingPeriodAllocationPercentage, secondVestingPeriodStart, secondVestingPeriodDuration, secondVestingPeriodAllocationPercentage, erc721Minter.address)) as Treasury;

        const mockErc20Contract = await ethers.getContractFactory("ERC20Betrust");
        erc20Betrust = (await mockErc20Contract.deploy(treasury.address, initialSupply, treasurySupply)) as ERC20Betrust;

      });
    });
    describe("set address of ERC20Betrust test", () => {
        it("should revert if erc20BetrustAddress = 0", async () => {
            await expect (treasury.connect(owner).setVestedTokenAddress(ethers.constants.AddressZero)).to.be.revertedWith(VestingErrors.VestedTokenIsZeroAddress); 
        });
    });
    describe("set address of ERC20Betrust test", () => {
        it("should revert if msg.sender is not owner", async () => {
            await expect (treasury.connect(minter1).setVestedTokenAddress(erc20Betrust.address)).to.be.revertedWith(OwnableErrors.NotOwner); 
        });
    });
    describe("set address of ERC20Betrust test", () => {
        it("should succesfully change erc20BetrustAddress", async () => {
            await treasury.connect(owner).setVestedTokenAddress(erc20Betrust.address);
            const newErc20BetrustAddress = await treasury.connect(minter1).vestedTokenAddress();
            expect(newErc20BetrustAddress).to.be.equal(erc20Betrust.address);
        });
    });
    describe("claim ERC20Betrust tokens test", () => {
        it("should revert if recipient does not hold any NFTs", async () => {
            await expect (treasury.connect(minter3).release()).to.be.revertedWith(VestingErrors.RecipientHasNothingToClaim); 
        });
    });
    describe("view start of vesting", () => {
      it("should be the same as first vesting period start", async () => {
          const start = await (treasury.callStatic.start())
          const startDecoded = BigNumber.from(start).toString();
          expect (startDecoded).to.be.equal(start);
      });
    });
    describe("view duration of vesting", () => {
      it("should be the same as last vesting period duration", async () => {
          const duration = await (treasury.callStatic.duration())
          const durationDecoded = BigNumber.from(duration).toString();
          expect (durationDecoded).to.be.equal(secondVestingPeriodDuration);
      });
    });
    describe("view currently active vesting period", () => {
      it("should be first vesting period", async () => {
        const blockNumber = await provider.getBlockNumber();
        const block = await provider.getBlock(blockNumber);
        const period = await (treasury.callStatic.currentlyActivePeriod())
        const periodDecoded = BigNumber.from(period).toString();
        expect (periodDecoded).to.be.equal(firstVestingPeriodId);
      });
    });
    describe("view amount of released vested tokens for recipient", () => {
      it("should be 0 before any claim", async () => {
          const released = await (treasury.callStatic.released(minter1.address));
          const releasedDecoded = BigNumber.from(released).toString();
          expect (releasedDecoded).to.be.equal(BigNumber.from(0));
      });
    });
    describe("view amount of vested tokens", () => {
      it("should be equal to 4% of allocation", async () => {
          const blockNumber = await provider.getBlockNumber()
          const block = await provider.getBlock(blockNumber)
          const vested = await (treasury.callStatic.vestedAmount(block.timestamp, ethers.utils.parseEther("1")));
          const vestedDecoded = BigNumber.from(vested).toString();
          expect (vestedDecoded).to.be.equal(ethers.utils.parseEther("0.04"));
      });
    });
    describe("view amount of vested tokens", () => {
      it("should be equal to 100% of allocation", async () => {
          const timestamp = start.add(BigNumber.from(5)).add(secondVestingPeriodDuration);
          const vested = await (treasury.callStatic.vestedAmount(timestamp, ethers.utils.parseEther("1")));
          const vestedDecoded = BigNumber.from(vested).toString();
          expect (vestedDecoded).to.be.equal(ethers.utils.parseEther("1"));
      });
    });
    describe("release vested tokens", () => {
      it("should release 100% of allocation", async () => {
          await (erc721Minter.connect(minter2).mint(minter2.address , 1, { value: tier1Price}));
          await provider.send("evm_increaseTime", [59]); // increase time
          await provider.send("evm_mine", []);
          treasury.connect(minter2).release()
          expect (await erc20Betrust.connect(minter2).balanceOf(minter2.address)).to.be.equal(ethers.utils.parseEther("1"));
      });
    });

    // const blockNumber = await provider.getBlockNumber()
    // const block = await provider.getBlock(blockNumber)

});