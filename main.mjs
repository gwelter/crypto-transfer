import { getAllDetails, withdraw, withdrawalHistory } from "./binance_api.mjs";
import { accountInfo as ftxAccountInfo, getWithdrawalFees } from "./ftx_api.mjs";

async function binance() {
  const coinDetails = (await getAllDetails()).find(asset => asset.coin === 'USDC');

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

  const history = await withdrawalHistory('USDT');
  console.log(details, history);
}

async function ftx() {
  const accInfo = await ftxAccountInfo();
  const withdrawalFee = await getWithdrawalFees('USDT', 10, process.env.B_USDT_BSC_WALLET)
  console.log(accInfo, withdrawalFee);
}

ftx();
