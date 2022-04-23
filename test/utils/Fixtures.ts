// import {expect} from 'chai';
// import {loadFixture, deployContract} from 'ethereum-waffle';
// import { ERC20Betrust } from "../../../typechain";

// describe('Fixtures', () => {
//   async function fixture([wallet: Wallet, other], provider) {
//     const token = await deployContract(wallet, ERC20Betrust, [
//       wallet.address, 1000
//     ]);
//     return {token, wallet, other};
//   }

//   it('Assigns initial balance', async () => {
//     const {token, wallet} = await loadFixture(fixture);
//     expect(await token.balanceOf(wallet.address)).to.equal(1000);
//   });

//   it('Transfer adds amount to destination account', async () => {
//     const {token, other} = await loadFixture(fixture);
//     await token.transfer(other.address, 7);
//     expect(await token.balanceOf(other.address)).to.equal(7);
//   });
// });