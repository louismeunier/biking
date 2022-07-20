const fetch = require('node-fetch')
import { getActivities } from '../lib/firebase-util';

// get all activities from the database
const handler = async function () {
  const data = await getActivities();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}

module.exports = { handler }
