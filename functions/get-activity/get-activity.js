import { getActivities, authorize } from '../lib/firebase-util';

// get all activities from the database
const handler = async function () {
  try {
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
  } catch (error) {
    console.log(error)
    return { headers: {
      "Access-Control-Allow-Origin": "*"
    }, statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
