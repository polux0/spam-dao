import { ethers, waffle } from "hardhat";
import { BigNumber, BigNumberish, utils } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import * as fs from "fs";
import { ERC721Minter } from "../../../typechain";
import {Erc721MintingErrors} from "../../utils/Errors";

const mnemonic = fs.existsSync(".secret")
  ? fs.readFileSync(".secret").toString().trim()
  : "test test test test test test test test test test test junk";

  describe("ERC721Minter", function () {
    
    const tier1Price: BigNumber = ethers.utils.parseEther("0.001");
    const belowTier1Price: BigNumber = ethers.utils.parseEther("0.0001");
    let provider = waffle.provider;
    let accounts: SignerWithAddress[];
    let mockBetrustTier1NFT: ERC721Minter;
    let owner: SignerWithAddress;
    let minter1: SignerWithAddress;
    let minter2: SignerWithAddress;
    let minter3: SignerWithAddress;
    let minter4: SignerWithAddress;
    let approvalTest: SignerWithAddress;
    let currentTimestamp: Number;
    let start: BigNumber = BigNumber.from(0);
    const baseUri: string = "https://ipfs.io/ipfs/QmehUeWdGzgn3vdb5fdCye2C1jtNsxhe7gHW94PKrJBGkP";
    const name: string = "BetrustTier1NFT";
    const symbol: string = "BTTT1NFT";

    this.beforeAll("Set accounts", async () => {
      accounts = await ethers.getSigners();
      const [_owner, _minter1, _minter2, _minter3, _minter4, _approvalTest] = accounts;
      owner = _owner;
      minter1 = _minter1;
      minter2 = _minter2;
      minter3 = _minter3;
      minter4 = _minter4;
      approvalTest = _approvalTest;
    });
  
    this.beforeAll("Set timestamps", async () => {
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);
      currentTimestamp = block.timestamp;
      // 5 seconds from now
      start = BigNumber.from(parseInt(currentTimestamp.toString()) + 5);
    });
  
    describe("deployment test", () => {
      it("deploy", async () => {
        const mockBetrustTier1NFTContract = await ethers.getContractFactory("ERC721Minter");
        mockBetrustTier1NFT = (await mockBetrustTier1NFTContract.deploy(start, baseUri, name, symbol)) as ERC721Minter;
      });
    });
    describe("minting test", () => {
      it("should prevent minting before start date", async () => {
        await expect(mockBetrustTier1NFT.connect(minter1).mint(minter1.address, 1, {value: tier1Price})).to.be.revertedWith(Erc721MintingErrors.MintingHasNotStartedYet);
      });
    });
    describe("minting test", () => {
      it("should prevent minting below the price", async () => {
        const increasePeriod = BigNumber.from(parseInt(start.toString()) + 10);
        await provider.send("evm_increaseTime", [increasePeriod.toNumber()]); // increase time
        await provider.send("evm_mine", []);
        await expect(mockBetrustTier1NFT.connect(minter1).mint(minter1.address , 1, {  value: belowTier1Price })).to.be.revertedWith(Erc721MintingErrors.InsufficientFundsProvided);
      });
    });
    describe("minting test", () => {
      it("should prevent minting > 5 tokens", async () => {
        const increasePeriod = BigNumber.from(parseInt(start.toString()) + 10);
        await provider.send("evm_increaseTime", [increasePeriod.toNumber()]); // increase time
        await provider.send("evm_mine", []);
        await (mockBetrustTier1NFT.connect(minter1).mint(minter1.address , 1, { value: tier1Price}));
        await (mockBetrustTier1NFT.connect(minter1).mint(minter1.address , 1, { value: tier1Price}));
        await (mockBetrustTier1NFT.connect(minter1).mint(minter1.address , 1, { value: tier1Price}));
        await (mockBetrustTier1NFT.connect(minter1).mint(minter1.address , 1, { value: tier1Price}));
        await (mockBetrustTier1NFT.connect(minter1).mint(minter1.address , 1, { value: tier1Price}));
        await expect(mockBetrustTier1NFT.connect(minter1).mint(minter1.address , 1, { value: tier1Price})).to.be.revertedWith(Erc721MintingErrors.TokensPerAddressCapReached);
      });
    });
    describe("minting test", () => {
      it("should increase eth balance of a contract if minting is sucessfull", async () => {
        const balanceBefore = await provider.getBalance(mockBetrustTier1NFT.address);
        await (mockBetrustTier1NFT.connect(minter2).mint(minter2.address, 1, {value: tier1Price}))
        const balanceAfter = await provider.getBalance(mockBetrustTier1NFT.address);
        expect(balanceAfter.sub(balanceBefore)).to.be.eq(tier1Price);
      });
    });
    describe("minting test", () => {
      it("should approve !owner address ", async () => {
        await (mockBetrustTier1NFT.connect(minter2).mint(minter2.address, 1, {value: tier1Price}))
        await (mockBetrustTier1NFT.connect(minter2).approve(approvalTest.address, 7));
      });
    });
    describe("minting test", () => {
      it("should transfer token ", async () => {
        await (mockBetrustTier1NFT.connect(minter3).mint(minter3.address, 1, {value: tier1Price}))
        const balanceOfMinter4Before = await(mockBetrustTier1NFT.connect(minter4).balanceOf(minter4.address))
        await (mockBetrustTier1NFT.connect(minter3).transferFrom(minter3.address, minter4.address, 8))
        const balanceOfMinter4After = await mockBetrustTier1NFT.balanceOf(minter4.address);
        expect(balanceOfMinter4After.sub(balanceOfMinter4Before)).to.be.eq(1);
      });
    });
    describe("calculation test", () => {
      it("should calculate value of nfts in erc20 ", async () => {
        await (mockBetrustTier1NFT.connect(minter3).mint(minter3.address, 1, {value: tier1Price}))
        const erc20Value = await (mockBetrustTier1NFT.callStatic.calculateERC20Value(minter3.address))
        const erc20ValueDecoded = BigNumber.from(erc20Value).toString();
        expect(erc20ValueDecoded).to.be.equal(ethers.utils.parseEther("1"));
      });
    });
});