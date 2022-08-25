import axios from 'axios';
import { URLSearchParams } from 'url';
import { createHmac } from 'crypto'

const apiKey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;

const isEmptyValue = input => {
  /**
   * Scope of empty value: falsy value (except for false and 0),
   * string with white space characters only, empty object, empty array
   */
  return (!input && input !== false && input !== 0) ||
    ((typeof input === 'string' || input instanceof String) && /^\s+$/.test(input)) ||
    (input instanceof Object && !Object.keys(input).length) ||
    (Array.isArray(input) && !input.length)
}

export const removeEmptyValue = obj => {
  if (!(obj instanceof Object)) return {}
  Object.keys(obj).forEach(key => isEmptyValue(obj[key]) && delete obj[key])
  return obj
}

async function privateCall(path, data, method = 'GET') {
  data = removeEmptyValue(data);
  const timestamp = Date.now();
  const querystring = new URLSearchParams({ ...data, timestamp }).toString()
  const signature = createHmac('sha256', apiSecret).update(querystring).digest('hex');

  const computedData = {
    ...data,
    timestamp,
    signature,
  }

  const qs = `?${new URLSearchParams(computedData).toString()}`
  const url = `${process.env.API_URL}${path}${qs}`

  try {
    const result = await axios({
      method,
      url,
      headers: { 'X-MBX-APIKEY': apiKey }
    })
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

async function publicCall(path, data, method = 'GET') {
  try {
    const qs = data ? `?${new URLSearchParams(data).toString()}` : '';
    const url = `${process.env.API_URL}${path}${qs}`
    const result = await axios({
      method,
      url
    });
    return result.data;
  } catch (error) {
    console.log(error)
  }
}

export async function getUserAssets(asset) {
  return privateCall('/sapi/v3/asset/getUserAsset', { asset }, 'POST');
}

export async function getAssetDetail(asset) {
  return privateCall('/sapi/v1/asset/assetDetail', { asset });
}

export async function getAllDetails() {
  return privateCall('/sapi/v1/capital/config/getall');
}

export async function systemStatus() {
  return privateCall('/sapi/v1/system/status');
}

export async function accountInfo() {
  return privateCall('/api/v3/account');
}

export async function apiRestrictions() {
  return privateCall('/sapi/v1/account/apiRestrictions');
}

export async function withdraw({ coin, address, amount, network }) {
  return privateCall('/sapi/v1/capital/withdraw/apply', { coin, address, amount, network }, 'POST')
}

export async function withdrawalHistory(coin) {
  return privateCall('/sapi/v1/capital/withdraw/history', { coin })
}

export async function exchangeInfo() {
  return publicCall('/api/v3/exchangeInfo')
}

export async function time() {
  return publicCall('/api/v3/time');
}