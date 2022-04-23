import { ethers, waffle } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ERC20Betrust } from "../../../typechain";


  describe("ERC20Betrust", function () {
    
    let provider = waffle.provider;
    let accounts: SignerWithAddress[];
    let treasury: SignerWithAddress;
    let erc20Betrust: ERC20Betrust;
    let owner: SignerWithAddress;
    let minter1: SignerWithAddress;
    let minter2: SignerWithAddress;
    let minter3: SignerWithAddress;
    let minter4: SignerWithAddress;
    let minter5: SignerWithAddress;
    let currentTimestamp: Number;
    let start: BigNumber = BigNumber.from(0);
    // constants
    const initialSupply: BigNumber = ethers.utils.parseEther("100");
    const treasurySupply: BigNumber = ethers.utils.parseEther("1");
    const approveAmount: BigNumber = ethers.utils.parseEther("0.1");

    this.beforeAll("Set accounts", async () => {
      accounts = await ethers.getSigners();
      const [_owner, _minter1, _minter2, _minter3, _minter4, _minter5, _treasury] = accounts;
      owner = _owner;
      minter1 = _minter1;
      minter2 = _minter2;
      minter3 = _minter3;
      minter4 = _minter4;
      minter5 = _minter5;

      treasury = _treasury;
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
        const mockErc20Contract = await ethers.getContractFactory("ERC20Betrust");
        erc20Betrust = (await mockErc20Contract.deploy(treasury.address, initialSupply, treasurySupply)) as ERC20Betrust;
      });
    });

    describe("ERC20Betrust test", () => {
        it("it should approve", async () => {
            const allowanceBefore = await erc20Betrust.connect(treasury).allowance(treasury.address, minter1.address);
            await erc20Betrust.connect(treasury).approve(minter1.address, approveAmount);
            const allowanceAfter = await erc20Betrust.connect(treasury).allowance(treasury.address, minter1.address);
            expect(allowanceAfter.sub(allowanceBefore)).to.be.equals(approveAmount);
      }); 
    });

    describe("ERC20Betrust test", () => {
        it("should increase allowance", async () => {
            await erc20Betrust.connect(treasury).increaseAllowance(minter2.address, approveAmount);
            const allowanceAfter = await erc20Betrust.connect(treasury).allowance(treasury.address, minter2.address);
            expect (BigNumber.from(allowanceAfter).toString()).to.be.equal(approveAmount)
        });
    });

    describe("ERC20Betrust test", () => {
        it("should decrease allowance", async () => {
            await erc20Betrust.connect(treasury).increaseAllowance(minter3.address, approveAmount);
            await erc20Betrust.connect(treasury).decreaseAllowance(minter3.address, approveAmount);
            const allowanceAfter = await erc20Betrust.connect(treasury).allowance(treasury.address, minter3.address);
            expect (BigNumber.from(allowanceAfter).toString()).to.be.equal(ethers.utils.parseEther("0"))
        });
    });

    describe("ERC20Betrust test", () => {
        it("should transfer", async () => {
            const minter4BalanceBefore = await erc20Betrust.connect(minter4).balanceOf(minter4.address);
            const treasuryBalanceBefore = await erc20Betrust.connect(treasury).balanceOf(treasury.address);
            await (erc20Betrust.connect(treasury).transfer(minter4.address, approveAmount));
            const minter4BalanceAfter = await erc20Betrust.connect(minter4).balanceOf(minter4.address);
            expect(minter4BalanceAfter.sub(minter4BalanceBefore)).to.be.equal(approveAmount);
        });
    });

    describe("ERC20Betrust test", () => {
        it("should transfer from", async () => {
            const minter5BalanceBefore = await erc20Betrust.connect(minter5).balanceOf(minter5.address);
            await (erc20Betrust.connect(treasury).increaseAllowance(treasury.address, approveAmount));
            await (erc20Betrust.connect(treasury).transferFrom(treasury.address, minter5.address, approveAmount));
            const minter5BalanceAfter = await erc20Betrust.connect(minter5).balanceOf(minter5.address);
            expect(minter5BalanceAfter.sub(minter5BalanceBefore)).to.be.equal(approveAmount);
        });
    })
});