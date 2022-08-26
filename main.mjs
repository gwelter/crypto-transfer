import { getAllDetails, withdraw, withdrawalHistory } from "./binance_api.mjs";
import { accountInfo as ftxAccountInfo, getWithdrawalFees, saveWalletAddress } from "./ftx_api.mjs";

async function binance() {
  const coinDetails = (await getAllDetails()).find(asset => asset.coin === 'BUSD');
  console.log(coinDetails);

  const details = {
    coin: coinDetails.coin,
    free: coinDetails.free,
    networkList: coinDetails.networkList.map(n => ({
      name: n.name,
      network: n.network,
      isDefault: n.isDefault,
      withdrawFee: n.withdrawFee,
      withdrawMin: n.withdrawMin,
      withdrawMax: n.withdrawMax,
    }))
  }

  // const withdrawResult = await withdraw({
  //   coin: coinDetails.coin,
  //   amount: 10,
  //   address: process.env.F_USDT_BSC_WALLET,
  //   network: 'BSC'
  // });

  const history = await withdrawalHistory('BUSD');
  console.log(details, history);
}

async function ftx() {
  // const accInfo = await ftxAccountInfo();
  // console.log(accInfo);
  // console.log('USDT', 10, process.env.B_USDT_BSC_WALLET);
  const withdrawalFee = await getWithdrawalFees('USDT', 10, process.env.B_USDT_BSC_WALLET)
  console.log(withdrawalFee);

  // const savedWallet = await saveWalletAddress('USDT', '0x726249005ec28bee84dca447ac11e0a0a2716922', 'USDT Binance BSC', 'BSC', 123);
  // console.log(savedWallet);
}

// ftx();
binance();
