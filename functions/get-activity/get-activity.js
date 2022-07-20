const fetch = require('node-fetch')
import { getActivities, authorize } from '../lib/firebase-util';

// get all activities from the database
const handler = async function () {
  const admin = await authorize();
  const db = admin.firestore();
  const data = await getActivities(db);
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}

module.exports = { handler }
