const fetch = require('node-fetch')
import { getTestData } from '../lib/firebase-util';

const handler = async function () {
  const data = await getTestData();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}

module.exports = { handler }
