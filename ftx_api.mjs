import axios from 'axios';
import { URLSearchParams } from 'url';
import { createHmac } from 'crypto';
import { removeEmptyValue } from './binance_api.mjs';

const apiKey = process.env.FTX_API_KEY;
const apiSecret = process.env.FTX_API_SECRET;

async function call(path, data, method = 'GET') {
  data = removeEmptyValue(data);

  let dataToSign = '';
  if (!Object.keys(data).length) {
    switch (method) {
      case 'GET':
      case 'DELETE':
        dataToSign = `?${new URLSearchParams({ ...data }).toString()}`;
        break;
      case 'PUT':
      case 'PATCH':
      case 'POST':
        dataToSign = JSON.stringify(data);
        break;
    }
  }

  const url = `${process.env.FTX_API_URL}${path}`
  const timestamp = Date.now();

  var signaturePayload = `${timestamp}${method}${path}${dataToSign}`;
  const signature = createHmac('sha256', apiSecret).update(signaturePayload).digest('hex');

  return axios({
    method,
    url,
    headers: {
      "FTX-KEY": apiKey,
      "FTX-SIGN": signature,
      "FTX-TS": timestamp
    }
  })
}

export async function accountInfo() {
  return call('/api/account');
}

export async function getWithdrawalFees(coin, amount, address) {
  return call('/api/wallet/withdrawal_fee', { coin, amount, address })
}
