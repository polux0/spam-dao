const { createOrder, signTypedDataOrder } = require("@airswap/utils");
import { BigNumber, constants } from "ethers";


export const getAirSwapOrder = async (
  sender: string,
  senderToken: string,
  senderTokenAmount: BigNumber | number,
  signer: string,
  signerToken: string,
  signerTokenAmount: string | number,
  swapContract: string,
  privateKey: any
) => {
  const order = createOrder({
    signer: {
      wallet: signer,
      token: signerToken,
      amount: signerTokenAmount,
    },
    sender: {
      wallet: sender,
      token: senderToken,
      amount: senderTokenAmount,
    },
    affiliate: {
      wallet: constants.AddressZero,
    },
    expiry: parseInt((Date.now() / 1000).toString(10)) + 86400 * 100,
  });
  const signedOrder = await signTypedDataOrder(order, privateKey, swapContract);
  return signedOrder;
};
