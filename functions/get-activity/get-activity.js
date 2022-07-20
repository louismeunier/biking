const fetch = require('node-fetch')
import { getActivities, authorize } from '../lib/firebase-util';

// get all activities from the database
const handler = async function () {
  const admin = await authorize();
  const db = admin.firestore();
  const data = await getActivities(db);

  await db.terminate();
  await admin.app().delete();
  return {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    statusCode: 200,
    body: JSON.stringify(data)
  }
}

module.exports = { handler }
